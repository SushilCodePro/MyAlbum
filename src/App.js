
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
function App() {
  
  const [mydata, setMyData] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ title: "Default new title", userId: 1, body: "this new body of new album" });
  const [albumToUpdate, setAlbumToUpdate] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.json();
      })
      .then((data => {
        // console.log("data",data);
        setMyData(data);

      }))
      .catch(error => {
        // Handle errors
        console.error('Error fetching data:', error);
      });
  }, [])
  function addAlbum() {
    const uniqueId = Date.now();
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({ ...newAlbum, id: uniqueId }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMyData((prevAlbum) => [data, ...prevAlbum]);
        setNewAlbum({ title: "Default new title", userId: 1, body: "this new body of new album" });
      })
      .catch((error) => {
        console.error('Error adding album:', error);
      })
    alert("added");
  }

  // function handleEdit(title) {
  //   setAlbumToUpdate(title);
  // }

  function handleUpdate() {
    if (!albumToUpdate) return;
    fetch(`https://jsonplaceholder.typicode.com/posts/${albumToUpdate.id}`, {
      method: 'PUT',
      body: JSON.stringify(albumToUpdate),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMyData((prevAlbum) => {
          return prevAlbum.map((album)=>(album.id===data.id ?data:album))
        });
        setAlbumToUpdate(null);
      })
      .catch((error) => {
        console.error('Error updating album:', error);
      })
    alert("updated");
  }
  function handleDelete(id){
    
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMyData((prevAlbum) => {
          return prevAlbum.filter((album)=>(album.id!==id))
        });
        // setAlbumToUpdate(null);
      })
      .catch((error) => {
        console.error('Error updating album:', error);
      })
    alert("Deleted");
  }
  console.log("mydata", mydata);

  return (
    <div className="App">
      <div className='left'>
        <div className=''>
          <h2>Add Album</h2>
          <label>Title:</label>
          <input
            type='text'
            value={newAlbum.title}
            onChange={(e) => (setNewAlbum({ ...newAlbum, title: e.target.value }))}
          />
          <button onClick={addAlbum}>Add</button>
        </div>
        <div className=''>
          <h2>Update Album</h2>
          {albumToUpdate && (
            <div>
              <label>Title:</label>
              <input
                type='text'
                value={albumToUpdate.title}
                onChange={(e) => setAlbumToUpdate({...albumToUpdate, title:e.target.value})}
              />
              <button onClick={handleUpdate}>Update</button>
            </div>
          )}

        </div>
      </div>
      <div className='right'>
        <ol>
          {mydata.map((album) => (
            <li key={album.id}>
              <strong>User ID:</strong> {album.userId} <br />
              <strong>Title:</strong> {album.title} <br />
              <strong>ID:</strong> {album.id} <br />
              <strong>Body:</strong> {album.body} <br />
              <button onClick={() => setAlbumToUpdate(album)}>Edit Title</button>
              <button onClick={()=>handleDelete(album.id)}>Delete</button>
              <hr />
            </li>
          ))}
        </ol>
      </div>

    </div>
  );
}

export default App;
