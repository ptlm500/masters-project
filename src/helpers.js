export function getComponentIdFromNodeId(nodeId) {
  if (nodeId.indexOf('_') > -1) {
    return nodeId.split('_')[0];
  }
  console.error(`helpers [getComponentIdFromNodeId]: Node id ${nodeId} Invalid`);
  return '';
}

export function uuid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    // eslint-disable-line no-bitwise
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export function getOutputNodeId(component) {
  let outputNodeId;
  component.get('nodes').keySeq().forEach(nodeId => {
    if (!component.getIn(['nodes', nodeId, 'input'])) {
      outputNodeId = nodeId;
      return false;
    }
    return true;
  });

  return outputNodeId;
}
