import models from 'models';
import { get, isEmpty } from 'lodash/fp';
import { logInfo, logDebug } from "utils";
import { gameplayPlayer, ship, playerFleet } from 'domains';
import { MapNotFoundException, ShipNotFoundException, InvalidMapCoordinationException } from 'exceptions';

const create = async({ gameplayPlayerId, shipId, headCoordinateX,
  headCoordinateY,tailCoordinateX, tailCoordinateY }) => {
  logInfo('Place a ship in map');

  const coordinate = [headCoordinateX, headCoordinateY, tailCoordinateX, tailCoordinateY ];

  if (coordinate.indexOf(-1) > -1) throw new InvalidMapCoordinationException();

  return models.sequelize.transaction(async () => {
    const results = await Promise.all([
      gameplayPlayer.findOneWithMapById(gameplayPlayerId),
      ship.findOneById(shipId),
      playerFleet.findAllByGameplayPlayerId(gameplayPlayerId)
    ]);

    // logDebug(results);
    const mapInfo = get(['0', 'gameplay', 'level', 'map'], results);
    const shipInfo = get('1', results);
    // const fleets = get('2', results);

    logDebug(mapInfo, shipInfo);
    if (isEmpty(mapInfo)) throw new MapNotFoundException();
    if (isEmpty(shipInfo)) throw new ShipNotFoundException();

    // coordination must not exceed map length


  });
};

export default {
  create,
};
