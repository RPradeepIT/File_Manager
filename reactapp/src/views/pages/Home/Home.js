import React from 'react'

import FileManager from '../../components/custom/FileManager/FileManager'
import './Home.css'

const Home = () => {
  return (
    <div className="filemanager-view">
      <div className="headertext"> File Manager</div>
      <FileManager
        idField="id"
        parentIDField="ParentID"
        folderField="ResourceType"
        folderFieldValue="Folder"
      />
    </div>
  )
}

export default Home
