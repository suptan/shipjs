import models from 'models';
// import { get, reduce } from 'lodash/fp';
import { logInfo } from "utils/logger";
import { gameplayPlayer, playerMap } from 'domains';
import { GameSessionNotFoundException } from 'src/exceptions';
// import { createEmptyBoard } from 'utils';

const create = async ({
  gameplayPlayerId,
  attackerId,
  seizedCoordinateX,
  seizedCoordinateY,
}) => {
  logInfo('Create a record of enemy damage');

  return models.sequelize.transaction(async () => {
    const gameplayer = await gameplayPlayer.findOneWithMapById(gameplayPlayerId);

    if (!gameplayer) throw new GameSessionNotFoundException();
    // TODO, check player profile
    // TODO, check attack coordinate in map area

    // const mapInfo = get(['0', 'gameplay', 'level', 'map'], gameplayer);
    const result = await playerMap.create({
      gameplayPlayerId,
      attackerId,
      seizedCoordinateX,
      seizedCoordinateY,
    });

    // After the attack
    //   - Attacker turn end and switch to defender
    //   - Calculate defender fleet damage
    //     + When all defender fleets sank, game will end

    return result;

    // TODO, refactor to ask for player status service
    // const playerMap = await playerMap.findAllByGamePlayerId(gameplayPlayerId);
    // const board = createEmptyBoard(mapInfo);
    // // Fill board damage
    // const re = reduce((sum, { seizedCoordinateX,seizedCoordinateY}) => {
    //   sum[seizedCoordinateY][seizedCoordinateX] = 1;
    //   return sum;
    // }, board)(playerMap);

  });
};

export default {
  create,
};
