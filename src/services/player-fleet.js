import models from 'models';
import { get, getOr, isEmpty, map } from 'lodash/fp';
import { logInfo, logDebug } from "utils";
import { gameplayPlayer, ship, playerFleet } from 'domains';
import { MapNotFoundException, ShipNotFoundException, InvalidMapCoordinationException, InvalidShipPlacementException } from 'exceptions';

const getCheckCell = async (a, b, min, max) => {
  return Promise.resolve({
    start: Math.max(min, (Math.min(a, b) - 1)),
    end: Math.min(max, (Math.max(a, b) + 1))
  });
};

const create = async(body) => {
  logInfo('Place a ship in map');
  const { gameplayPlayerId, shipId, headCoordinateX,
    headCoordinateY, tailCoordinateX, tailCoordinateY } = body;
  // TODO, check pair of x or y must be equal before process
  // headXY != tailXY unless submarine
  // all coordinations must be greater than 0
  const coordinates = [headCoordinateX, headCoordinateY, tailCoordinateX, tailCoordinateY];

  if (coordinates.indexOf(-1) > -1) throw new InvalidMapCoordinationException();

  return models.sequelize.transaction(async (transaction) => {
    const results = await Promise.all([
      gameplayPlayer.findOneWithMapById(gameplayPlayerId),
      ship.findOneById(shipId),
      playerFleet.findAllByGameplayPlayerId(gameplayPlayerId)
    ]);

    // logDebug(results);
    const mapInfo = get(['0', 'gameplay', 'level', 'map'], results);
    const shipInfo = get('1', results);
    const fleets = get('2', results);
    const len = getOr(0, 'length', fleets);

    // logDebug(mapInfo, shipInfo);
    if (isEmpty(mapInfo)) throw new MapNotFoundException();
    if (isEmpty(shipInfo)) throw new ShipNotFoundException();
    // TODO, check coordinations must be matched with ship size
    // TODO, check ship must not exceed maximum for the level

    // TOFIX, change to object
    const normalizeCoords = map( num => num - 1, coordinates);
    // TODO, coordination must be positive or not exceed map length


    // Create a board which no ship in any cells
    const { gridHorizontal, gridVertical } = mapInfo;
    let board = [];
    while (board.length < gridVertical) {
      // deep clone array
      const rows = [];
      rows[gridHorizontal - 1] = 0;
      board.push(rows);
    }
    // logDebug('board', board);

    // Fill existing ship into the board
    logDebug('len', len);
    for (let i = 0; i < len; i +=1) {
      // Since coordination reflect to index of array before save to database
      // so we don't need to convert anything here
      const { headCoordinateX: headX,
        headCoordinateY: headY,
        tailCoordinateX: tailX,
        tailCoordinateY: tailY,
        shipId: fleetId,
      } = fleets[i];
      logDebug('Check coordination of', fleetId);
      // TOFIX, reduce variable
      const rowLen = Math.abs(headY - tailY);
      const colLen = Math.abs(headX - tailX);
      const startRow = Math.min(headY, tailY);
      const startCol = Math.min(headX, tailX);
      const endRow = startRow + rowLen;
      const endCol = startCol + colLen;

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          board[i][j] = 1;
        }
      }
    }
    logDebug('board with ship', board);

    // Place new ship into the board
    const isVertical = normalizeCoords[0] === normalizeCoords[2];
    logInfo(isVertical ? 'Ship place in vertical' : 'Ship place in horizontal');
    // let firstCheckCell = 0;
    // let lastCheckCell = 0;
    logDebug('normalizeCoords', normalizeCoords);
    const checkCells = isVertical
      ? await getCheckCell(normalizeCoords[1], normalizeCoords[3], 0, gridVertical - 1)
      : await getCheckCell(normalizeCoords[0], normalizeCoords[2], 0, gridHorizontal - 1);
    logDebug('checkCells', checkCells);

    // Check that new ship is not place overlap with another ship(s)
    // and there must be a space between each of them
    const stableCell = normalizeCoords[isVertical ? 0 : 1];
    const left = Math.max(0, stableCell + 1);
    const right = Math.min(gridHorizontal - 1, stableCell - 1);
    logDebug('left', left);
    logDebug('right', right);
    for (let i = checkCells.start; i <= checkCells.end; i++) {
      let starboard,current, larboard;
      logDebug('current', `${i} || ${stableCell};;${board[i][stableCell]}`);

      // Ship can place here because there is a space on both starboard and larboard
      if (isVertical) {
        starboard = get([`${i}`, `${left}`], board);
        current = get([`${i}`, `${stableCell}`], board);
        larboard = get([`${i}`, `${right}`], board);
        // For debug
        board[i][left] = 1;
        board[i][right] = 1;
        logDebug(board);
      } else {
        starboard = get([`${left}`, `${i}`], board);
        current = get([`${stableCell}`, `${i}`], board);
        larboard = get([`${right}`, `${i}`], board);
        // For debug
        board[left][i] = 1;
        board[right][i] = 1;
        logDebug(board);
      }

      if (starboard || larboard || current) throw new InvalidShipPlacementException();
    }

    logInfo('The criteria for place a ship is matched');
    // return { transaction };
    return await playerFleet.create(
      {
        ...body,
        headCoordinateX: normalizeCoords[0],
        headCoordinateY: normalizeCoords[1],
        tailCoordinateX: normalizeCoords[2],
        tailCoordinateY: normalizeCoords[3],
      }, { transaction });
  });
};

export default {
  create,
};
