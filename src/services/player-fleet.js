import models from 'models';
import { filter, get, getOr, isEmpty, map } from 'lodash/fp';
import { logInfo, logDebug, createEmptyBoard } from "utils";
import { gameplayPlayer, ship, playerFleet } from 'domains';
import { MapNotFoundException, ShipNotFoundException, InvalidMapCoordinationException, InvalidShipPlacementException } from 'exceptions';
import { playerFleetSerializer } from 'serializers';

const getCheckCell = async (a, b, min, max) => {
  return Promise.resolve({
    start: Math.max(min, (Math.min(a, b) - 1)),
    end: Math.min(max, (Math.max(a, b) + 1))
  });
};

export const getShipOnBoard = async (len, fleets, board) => {
  const result = map(row => row.slice() ,board);
  for (let i = 0; i < len; i += 1) {
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
        result[i][j] = 1;
      }
    }
  }

  return result;
};

const create = async(body) => {
  logInfo('Place a ship in map');
  const { defenderId, shipId, headCoordinateX,
    headCoordinateY, tailCoordinateX, tailCoordinateY } = body;
  // TODO, check pair of x or y must be equal before process
  // headXY != tailXY unless submarine
  // all coordinations must be positive number or 0
  const normalizeCoords = [headCoordinateX, headCoordinateY, tailCoordinateX, tailCoordinateY];

  logInfo('validate request coordinate');
  if (!isEmpty(filter(num => Math.sign(num) < 0, normalizeCoords)))
    throw new InvalidMapCoordinationException();
  if (normalizeCoords[0] !== normalizeCoords[2] && normalizeCoords[1] !== normalizeCoords[3])
    throw new InvalidMapCoordinationException();

  return models.sequelize.transaction(async (transaction) => {
    const results = await Promise.all([
      gameplayPlayer.findOneWithMapById(defenderId),
      ship.findOneById(shipId),
      playerFleet.findAllByGameplayPlayerId(defenderId)
    ]);

    // logDebug(results);
    const gameplayPlayerInfo = get('0', results);
    const mapInfo = get(['gameplay', 'level', 'map'], gameplayPlayerInfo);
    const shipInfo = get('1', results);
    const fleets = get('2', results);
    const len = getOr(0, 'length', fleets);
    const rowDiff = Math.abs(normalizeCoords[1] - normalizeCoords[3]);
    const colDiff = Math.abs(normalizeCoords[0] - normalizeCoords[2]);
    const requestShipSize = Math.max(rowDiff,colDiff) + 1;

    logInfo('validate request map and ship with database');
    // logDebug(mapInfo, shipInfo);
    if (isEmpty(mapInfo)) throw new MapNotFoundException();
    if (isEmpty(shipInfo)) throw new ShipNotFoundException();
    // check coordinations must be matched with ship size
    if (shipInfo.size !== requestShipSize) throw new ShipNotFoundException();
    // TODO, check ship must not exceed maximum for the level

    const { gridHorizontal, gridVertical } = mapInfo;
    // TOFIX, change to object
    // const normalizeCoords = map( num => num - 1, coordinates);
    // TODO, coordination must not exceed map length
    // TOFIX, allow ship to rotate only 180 degree
    // logDebug('normalizeCoords', normalizeCoords);
    if (Math.max(normalizeCoords[0], normalizeCoords[2]) >= gridHorizontal
          || Math.max(normalizeCoords[1], normalizeCoords[3]) >= gridVertical)
      throw new InvalidMapCoordinationException();

    logDebug('len', len);
    logDebug('gameplayPlayerInfo', gameplayPlayerInfo);
    // Fill existing ship into the board
    // TOFIX, store to DB
    // const board = await getShipOnBoard(len, fleets, emptyBoard);
    const board = get('playerMap', gameplayPlayerInfo) || createEmptyBoard(mapInfo);
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
      let starboard, current, larboard;
      logDebug('current', `${i} || ${stableCell};;${board[i][stableCell]}`);

      // Ship can place here because there is a space on both starboard and larboard
      if (isVertical) {
        starboard = get([`${i}`, `${left}`], board);
        current = get([`${i}`, `${stableCell}`], board);
        larboard = get([`${i}`, `${right}`], board);
        // For debug
        // board[i][left] = 1;
        // board[i][right] = 1;
        // logDebug(board);
      } else {
        starboard = get([`${left}`, `${i}`], board);
        current = get([`${stableCell}`, `${i}`], board);
        larboard = get([`${right}`, `${i}`], board);
        // For debug
        // board[left][i] = 1;
        // board[right][i] = 1;
        // logDebug(board);
      }

      if (starboard || larboard || current) {
        console.log('foo', !!starboard , !!larboard , !!current);
        throw new InvalidShipPlacementException();}
      console.log('next');
    }

    logInfo('The criteria for place a ship is matched');
    // Update player map with new ship
    const rows = [normalizeCoords[1], normalizeCoords[3]].sort();
    const cols = [normalizeCoords[0], normalizeCoords[2]].sort();
    const hp = [];
    for (let i = rows[0]; i <= rows[1]; i++) {
      for (let j = cols[0]; j <= cols[1]; j++) {
        board[i][j] = 1;
        hp.push([i, j]);
      }
    }

    const dbResults = await Promise.all([
      playerFleet.create(
        {
          ...body,
          gameplayPlayerId: defenderId,
          hp,
        }, { transaction }),
      gameplayPlayer.createOrUpdate({
        id: defenderId,
        status: get('status', gameplayPlayerInfo),
        playerMap: board
      }, { transaction })
    ]);

    const newPlayerFleet = dbResults[0];

    return {
      playerFleet: playerFleetSerializer(newPlayerFleet),
    };
  });
};

export default {
  create,
};
