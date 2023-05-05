import React from 'react'
import { useQueries, useQuery } from 'react-query'

import _ from 'lodash'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { data } from 'react-dom-factories'
import useAppContext from '../../hooks/useToast'
import getAPIData from '../../../../models/api/api'
import apiEndPoints from '../../../../models/api/apiEndpoints'
import FFTreeView from '../../base/FFTreeView/FFTreeView'
import './FileManager.css'

function fileManagerReducer(state, action) {
  switch (action.type) {
    case 'SET_TREE_DATASOURCE':
      return {
        ...state,
        treeDataSource: action.payload,
      }
    case 'SET_SELECTED_TREENODE':
      return {
        ...state,
        ...action.payload,
      }
    case 'SET_SELECTEDDATA':
      return {
        ...state,
        ...action.payload,
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const FileManager = ({
  idField,
  parentIDField,
  folderField,
  folderFieldValue,
}) => {
  const initialState = {
    treeDataSource: [],
    selectedTreeNode: null,
    childrens: [],
    mainselectedData: 'C:/',
    selectedData: 'C:/',
  }
  const [state, dispatch] = React.useReducer(fileManagerReducer, initialState)
  const { showToastMessage, showLoading } = useAppContext()

  const [appResourceData] = useQueries([
    {
      queryKey: ['fileManager', 'appResourceData'],
      queryFn: () =>
        getAPIData(
          apiEndPoints.Getfolderlist.method,
          `${apiEndPoints.Getfolderlist.url}?selected=${state.mainselectedData}`
        ).then((response) => response.data.data),
      placeholderData: [],
    },
    // {
    //   queryKey: ['fileManager', 'appResourceDataDetail'],
    //   queryFn: () =>
    //     getAPIData(
    //       apiEndPoints.Getfilesdetails.method,
    //       `${apiEndPoints.Getfilesdetails.url}?selected=${state.selectedData}`
    //     ).then((response) => response.data.data),
    //   enabled: !!state.selectedData && !!state.selectedData,
    //   placeholderData: [],
    // },
  ])

  const appResourceDataDetail = useQuery(
    ['fileManager', state.selectedData],
    () =>
      getAPIData(
        apiEndPoints.Getfilesdetails.method,
        `${apiEndPoints.Getfilesdetails.url}?selected=${state.selectedData}`
      ).then((response) => response.data.data),
    {
      enabled: !!state.selectedData,
      placeholderData: [],
      retry: false,
    }
  )
  // function getChildrens(parentID) {
  //   if (appResourceData.isFetching || !appResourceData.data) return []

  //   if (!parentID) return appResourceData.data

  //   const childrens = _.filter(appResourceData.data, (data) => {
  //     if (_.isArray(data[parentIDField]) && !_.isEmpty(data[parentIDField]))
  //       return data[parentIDField][0].id === parentID

  //     return false
  //   })
  //   return childrens
  // }

  function onTreeItemChangeHandler(e, params) {
    // const childrens = getChildrens(params.value)

    const fullpath = appResourceData.data.find(
      (item) => item.id === params.value
    )
    dispatch({
      type: 'SET_SELECTED_TREENODE',
      payload: {
        selectedNode: params.value,
      },
    })
    dispatch({
      type: 'SET_SELECTEDDATA',
      payload: {
        selectedData: fullpath?.fullpath || state.mainselectedData,
      },
    })
  }

  function getTreeDataSource() {
    if (appResourceData.isFetching || !appResourceData.data) return []

    let treeDataSource = _.cloneDeep([
      {
        id: '7c10a0d2-6740-4cba-8bd4-a7f2d3c340000',
        Name: `Local Disk(${state.mainselectedData.substring(0, 1)}:)`,
        fullpath: state.mainselectedData,
        ResourceType: 'Folder',
      },
      ...appResourceData.data,
    ])
    treeDataSource = treeDataSource.filter(
      (data) => data[folderField] === folderFieldValue
    )
    return treeDataSource
  }

  const filextensionlist = appResourceDataDetail?.data?.Extensionlist || []

  return (
    <div className="file-manager">
      <div className="file-manager__foldertree">
        {appResourceData.isFetching ? (
          'Loading'
        ) : (
          <FFTreeView
            id="file-manager-treeview"
            src={getTreeDataSource()}
            uniqueIDKey={idField}
            parentIDKey={parentIDField}
            labelKey="Name"
            onChangeHandler={onTreeItemChangeHandler}
          />
        )}
      </div>
      <div className="file-manager__listview">
        <div className="file-manager__container">
          <div className="file-manager__column">
            <p className="textview_main">Total Number of files</p>
            <p className="textview_sub">
              {appResourceDataDetail?.data?.Totalfiles}
            </p>
          </div>
          <div className="file-manager__column">
            <p className="textview_main">Total Number of File Extensions</p>
            <p className="textview_sub">
              {appResourceDataDetail?.data?.TotalExtension}
            </p>
          </div>
          <div className="file-manager__column">
            <p className="textview_main">Total Number of Size of the file</p>
            <p className="textview_sub">
              {appResourceDataDetail?.data?.TotalSize}
            </p>
          </div>
        </div>
        <div className="file-manager__container">
          <div className="file-manager__column2">
            <p className="textview_main">List of All Extension</p>
            <p className="textview_sub_list">
              {filextensionlist.length !== 0 &&
                filextensionlist.map((item) => {
                  return <div>{item.toUpperCase()}</div>
                })}
            </p>
          </div>
          <div className="file-manager__column2">
            <div className="file-manager__column3">
              <p className="textview_main">
                Total Number of File with no extensions
              </p>
              <p className="textview_sub">
                {appResourceDataDetail?.data?.TotalnoneExtension}
              </p>
            </div>
            <div className="file-manager__column3" />
            <div className="file-manager__column3" />
            <div className="file-manager__column3" />
          </div>
          <div className="file-manager__column2">
            <div className="file-manager__column3" />
            <div className="file-manager__column3" />
            <div className="file-manager__column3" />
            <div className="file-manager__column3" />
          </div>
        </div>
      </div>
    </div>
  )
}

FileManager.propTypes = {
  idField: PropTypes.string.isRequired,
  parentIDField: PropTypes.string.isRequired,
  folderField: PropTypes.string.isRequired,
  folderFieldValue: PropTypes.string.isRequired,
}

export default FileManager
