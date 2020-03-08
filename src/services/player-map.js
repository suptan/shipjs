import models from 'models';
import { get, map, reduce } from 'lodash/fp';
import { logInfo, logDebug } from "utils/logger";
import { gameplayPlayer, playerMap } from 'domains';
import { GameSessionNotFoundException } from 'src/exceptions';
import { createEmptyBoard } from 'utils';
import PLAYER_FLEET_STATUS from 'constants/player-fleet-status';

const create = async ({
  gameplayPlayerId,
  //   attackerId,
  seizedCoordinateX,
  seizedCoordinateY,
}) => {
  logInfo('Create a record of enemy damage');

  return models.sequelize.transaction(async (transaction) => {
    const gameplayer = await gameplayPlayer.findOneWithMapAndFleetById(gameplayPlayerId);

    if (!gameplayer) throw new GameSessionNotFoundException();
    // TODO, check player profile
    // TODO, check attack coordinate in map area
    // TODO, check attacker turn
    // TODO, check game plan phase should end before attack start

    const attack = { row: seizedCoordinateY - 1, col: seizedCoordinateX - 1 };
    logDebug('Attack coordinate', attack);
    // await playerMap.create({
    //   gameplayPlayerId,
    //   attackerId,
    //   seizedCoordinateX: attack.col,
    //   seizedCoordinateY: attack.row,
    // }, { transaction });
    const mapInfo = get(['gameplay', 'level', 'map'], gameplayer);
    const playerFleets = get(['playerFleet'], gameplayer);

    // After the attack
    //   - Attacker turn end and switch to defender
    //   - Calculate defender fleet damage
    //     + When all defender fleets sank, game will end

    logInfo('Calculate defender fleet damage');
    // TODO, refactor to ask for player status service
    const playerMapInfo = await playerMap.findAllByGamePlayerId(gameplayPlayerId);
    const board = createEmptyBoard(mapInfo);
    // Fill board damage
    // TOFIX, store board state to DB
    const seizedBoard = map(row => row.slice(), board);
    reduce((sum, { seizedCoordinateX: col, seizedCoordinateY: row }) => {
      sum[row][col] = 1;
      return sum;
    }, seizedBoard)(playerMapInfo);
    logDebug('seizedBoard', seizedBoard);
    // logDebug('board', board);

    // const shipOnBoard =  await getShipOnBoard(playerFleets.length, playerFleets, board);
    // logDebug('ship on board', shipOnBoard);

    // TOFIX, store ship location as an array of object with coordinator and hit,
    // then update hit data to true where coordinator is matched
    // after that check all hits in array is true then sank the ship
    // Check ships damage
    const updatedFleetsCallbacks = [];
    let confirmHit = false;
    map(({
      id, status, ship: { size },
      headCoordinateX, headCoordinateY, tailCoordinateX, tailCoordinateY,
    }) => {
      // Ignore damage calculation for Sunken ship
      // or ship not in the attack range
      if (status === PLAYER_FLEET_STATUS.SANK) return;
      logDebug('playerFleets', id);
      const row = [headCoordinateY, tailCoordinateY].sort();
      const col = [headCoordinateX, tailCoordinateX].sort();
      logDebug(row , col);
      let count = 0;
      for (let i = row[0]; i <= row[1]; i++) {
        for (let j = col[0]; j <= col[1]; j++) {
          if (i === attack.row && j === attack.col) {
            logInfo('Attacker successfully hit a ship');
            confirmHit = true;
            count++;
          } else if (seizedBoard[i][j]) count++;

          if(count === size) {
            logInfo('Attacker just sank a ship');
            updatedFleetsCallbacks.push(1);
          }
        }
      }
      logDebug(`Ship damage ${count}`, `Ship hp ${size} - ${count}`);

    }, playerFleets.slice(3));

    // When defender has no ship left, attacker win and game will end

    return {
      message: confirmHit ? 'Hit' : 'Miss',
      transaction
    };
  });
};

export default {
  create,
};
