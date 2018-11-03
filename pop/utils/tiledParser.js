function tiledParser(json) {
  const {
    tilewidth: tileW,
    tileheight: tileH,
    width: mapW,
    height: mapH,
    layers,
    tilesets
  } = json
  // debugger

  const getLayer = name => {
    const layer = layers.find(layer => layer.name === name)
    if (!layer) {
      throw new Error(`Tiled Error: Missing layer "${name}".`)
    }
    return layer
  }

  const getTileset = idx => {
    if (!tilesets || !tilesets[idx]) {
      throw new Error(`Tiled Error: Missing tileset index "${idx}".`)
    }
    return tilesets[idx]
  }

  const levelLayer = getLayer('Level')
  const entitiesLayer = getLayer('Entities')
  const entities = entitiesLayer.objects.map(
    ({ x, y, width, height, properties, type, name }) => ({
      x,
      y: y - height, // fix tiled Y alignment
      width,
      height,
      properties,
      type,
      name
    })
  )

  const getObjectsByType = (type, mandatory = false) => {
    const es = entities.filter(object => object.type === type)
    if (!es.length && mandatory) {
      throw new Error(`Tiled Error: Missing an object of type "${type}".`)
    }
    return es
  }

  const getObjectByName = (name, mandatory = false) => {
    const ent = entities.find(entity => entity.name === name)
    if (!ent && mandatory) {
      throw new Error(`Tiled Error: Missing named object "${name}".`)
    }
    return ent
  }

  // Map the Tiled level data to our game format.
  const tileset = getTileset(0)
  const props = tileset.tileproperties // extra tile properties: walkable, clouds
  const tilesPerRow = Math.floor(tileset.imagewidth / tileset.tilewidth)
  // debugger
  const tiles = levelLayer.data.map(cell => {
    const idx = cell - tileset.firstgid // get correct Tiled offset
    // debugger
    return Object.assign({}, props && props[idx] || {}, {
      x: idx % tilesPerRow,
      y: Math.floor(idx / tilesPerRow)
    })
  })
  // debugger

  return {
    tileW,
    tileH,
    mapW,
    mapH,
    tiles,
    getObjectByName,
    getObjectsByType
  }
}

export default tiledParser