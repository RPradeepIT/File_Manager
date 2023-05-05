/* eslint-disable no-unused-expressions */
import { v4 as generateGUID } from 'uuid'
import _ from 'lodash'

const removeKeyFromObject = (obj, keysToRemove = []) => {
  let objClone = _.cloneDeep(obj)
  if (!Array.isArray(obj)) objClone = [objClone]

  return objClone.map((objItem) => {
    keysToRemove.map((keyItem) => delete objItem[keyItem])

    return objItem
  })
}

function transformJSONToTree(arr, uniqueKey, parentKey) {
  const nodes = {}
  return _.cloneDeep(arr).filter(function (obj) {
    const id = obj[uniqueKey]
    const parentId =
      Array.isArray(obj[parentKey]) && obj[parentKey].length > 0
        ? obj[parentKey][0].id
        : obj[parentKey]

    nodes[id] = _.defaults(obj, nodes[id], { children: [] })
    parentId &&
      (nodes[parentId] = nodes[parentId] || { children: [] }).children.push(obj)

    return !parentId
  })
}

function getAllChildrens(arr, parentID, parentKeyField, uniqueIDField) {
  if (!Array.isArray(arr)) return []

  return arr.reduce((acc, curr) => {
    const parentUniqueID =
      _.isArray(curr[parentKeyField]) && curr[parentKeyField].length > 0
        ? curr[parentKeyField][0].id
        : curr[parentKeyField]

    if (parentUniqueID === parentID)
      return acc.concat(
        curr,
        ...getAllChildrens(
          arr,
          curr[uniqueIDField],
          parentKeyField,
          uniqueIDField
        )
      )

    return acc
  }, [])
}

export default {
  generateGUID,
  removeKeyFromObject,
  transformJSONToTree,
  getAllChildrens,
}
