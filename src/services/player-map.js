import models from 'models';
import { filter, find, get, isEmpty, isEqual, map, values } from 'lodash/fp';
import { logInfo, logDebug } from "utils/logger";
import { gameplayPlayer, playerMap, playerFleet } from 'domains';
import { GameSessionNotFoundException, GameSessionEndException } from 'src/exceptions';
import PLAYER_FLEET_STATUS from 'constants/player-fleet-status';
import GAME_STATUS from 'constants/gameplay-status';

const create = async ({
  defenderId,
  attackerId,
  seizedCoordinateX,
  seizedCoordinateY,
}) => {
  logInfo('Create a record of enemy damage');

  // TODO, defender and attacker must be different

  return models.sequelize.transaction(async (transaction) => {
    const defender = await gameplayPlayer.findOneWithMapAndFleetById(defenderId);

    if (!defender) throw new GameSessionNotFoundException();
    // TODO, check player profile
    // TODO, check attack coordinate in map area and positive or 0
    // TODO, check attacker turn
    const { gameplay } = defender;

    if (gameplay.status === GAME_STATUS.END)
      throw new GameSessionEndException();
    // TODO, game should be in battle phase (the defender already place all ships)
    // before attacker begin


    const attack = { row: seizedCoordinateY, col: seizedCoordinateX };
    logDebug('Attack coordinate', attack);
    await playerMap.create({
      defenderId,
      attackerId,
      seizedCoordinateX: attack.col,
      seizedCoordinateY: attack.row,
    }, { transaction });
    const playerFleets = get(['playerFleet'], defender);

    // After the attack
    //   - Attacker turn end and switch to defender
    //   - Calculate defender fleet damage
    //     + When all defender fleets sank, game will end

    logInfo('Calculate defender fleet damage');
    // TODO, refactor to ask for player status


    // Fill board damage
    const seizedBoard = defender.playerMap;
    logDebug('seizedBoard', seizedBoard);

    // TOFIX, store ship location as an array of object with coordinator and hit,
    // then update hit data to true where coordinator is matched
    // after that check all hits in array is true then sank the ship
    // Check ships damage
    let confirmHit = !!seizedBoard[attack.row][attack.col];
    let isWinner = false;
    let sunkenShip = 0;
    let damageShip = 0;
    let calHp = [];

    // Update player map info
    seizedBoard[attack.row][attack.col] = 2;
    const updateMap = defender.update({ playerMap: seizedBoard }, { transaction });

    // Check ship status
    map(({
      id, status, ship: { name }, hp,
      headCoordinateX, headCoordinateY, tailCoordinateX, tailCoordinateY,
    }) => {
      // Ignore damage calculation for Sunken ship
      // or ship not in the attack range
      if (status === PLAYER_FLEET_STATUS.SANK) return;
      logDebug('playerFleets', id);
      const row = [headCoordinateY, tailCoordinateY].sort();
      const col = [headCoordinateX, tailCoordinateX].sort();
      const focusCell = values(attack);
      logDebug(row , col);

      calHp = filter(cell => !isEqual(focusCell, cell), hp);

      if (isEmpty(calHp)) {
        logInfo('Attacker just sank a ship');
        sunkenShip = {
          fleetId: id,
          name
        };

        return;
      } else if (!isEqual(hp, calHp)) {
        damageShip = {
          id,
          hp: calHp,
        };
      }
    }, playerFleets);

    // Attacker either damage or sank the ship
    if (sunkenShip) {
      logInfo('Sank defender ship');
      await playerFleet.updatedSink(
        find(({ id }) => sunkenShip.fleetId === id, playerFleets),
        { transaction }
      );
    } else if (damageShip) {
      logInfo('Reduce ship hp');
      await playerFleet.updateById(damageShip, { transaction });
    }

    // When defender has no ship left, attacker win and game will end
    const sankShips = filter(({ status }) => status === PLAYER_FLEET_STATUS.SANK, playerFleets);

    if (sankShips.length === playerFleets.length) {
      logInfo('We have the winner');
      isWinner = true;
    }

    let message = 'Miss';

    if (isWinner) {
      // The record which had been created in this connection won't be appear
      const [moves] = await Promise.all([
        playerMap.findAttackAttempts({ attackerId }),
        gameplay.update({ winnerId: attackerId, status: GAME_STATUS.END }, { transaction }),
      ]);
      message = `Win! You have completed the game in ${moves + 1} moves`;
    }
    else if (confirmHit) {
      logInfo('Attacker successfully hit a ship');
      message = sunkenShip ? `You just sank a ${sunkenShip.name}` : 'Hit';
    }

    // Ensure map data is updated
    await updateMap;

    return {
      message,
    };
  });
};

export default {
  create,
};
