import { pick } from 'lodash/fp';

const attributes = ['id', 'gameplayPlayerId', 'shipId', 'headCoordinateX', 'headCoordinateY', 'tailCoordinateX', 'tailCoordinateY', 'status'];

export default (model) => (pick(attributes, model));
