import { get, map, uniq } from 'lodash/fp';
import { LobbyEmptyException, LevelNotFoundException } from 'exceptions';
import { gameplay, level, player, gameplayPlayer } from 'domains';
import model from 'models';
import { logInfo, logDebug } from 'utils';

const create = async ({ levelId, players }) => {
  logInfo('create new game.');

  const playerIds = uniq(map('id', players));

  if (playerIds.length < 2) {
    logInfo('players are not enough to create a game.');
    throw new LobbyEmptyException();
  }

  return model.sequelize.transaction(async (transaction) => {
    const results = await Promise.all([
      level.findOneById(levelId),
      player.findAllByIds(playerIds)
    ]);
    const levelInfo = get('0', results);
    const playerProfiles = get('1', results);

    logDebug(playerProfiles, playerProfiles[0].id);

    if (!levelInfo) throw new LevelNotFoundException();
    if (playerProfiles.length < 2) throw new LobbyEmptyException();

    // Create a new game for players to join
    logInfo('Creating a new game');
    const newGameplay = await gameplay.create({ levelId: get('id', levelInfo) }, { transaction });
    // const newGameplay = await model.gameplay.findByPk(1, { transaction });
    const newGameId = newGameplay.id;
    logDebug('Done a new game', newGameId);
    const validPlayerIds = map('id', playerProfiles);

    // Assign players to the game session
    const gamePlayer = await gameplayPlayer.bulkCreate({ gameplayId: newGameId, playerIds: validPlayerIds }, { transaction });
    logDebug('gamePlayer', map('playerId', gamePlayer));

    return {
      id: newGameplay.id,
      players: {
        attackerId: get(['0', 'id'], gamePlayer),
        defenderId: get(['1', 'id'], gamePlayer),
      },
    };
  });
};

const findFullGameInfoById = async (id, include) => {
  const normalizeInclude = [];
  if (include) {
    // TOFIX, create as util
    // if (include.includes('gameplayPlayer'))
    if (include.includes('gameplayPlayer.playerFleet')) {
      const modelAssociate = {
        model: model.gameplayPlayer,
        as: 'gameplayPlayer',
        include: [{
          model: model.playerFleet,
          as: 'playerFleet',
        }],
      };
      normalizeInclude.push(modelAssociate);
    }
  }
  const gameInfo = await gameplay.findWithFleetsStatusById(id, normalizeInclude);

  return gameInfo;
};

export default {
  create,
  findFullGameInfoById,
};
