import React, { useState, useEffect, useRef } from 'react';
import './github.css';
import useGithubUsers from '../../components/features/Users';

const Github = () => {
  const { searchQuery, setSearchQuery, filteredUsers, loading } = useGithubUsers();
  const [selectedUser, setSelectedUser] = useState(null); 
  const [showDropdown, setShowDropdown] = useState(false); 
  const dropdownRef = useRef(null); 
  const [starCount, setStarCount] = useState(0);
  const [repos, setRepos] = useState([]);
  const [sortBy, setSortBy] = useState("name") 
  const handleSortChange = (sortOption) =>{
    setSortBy(sortOption)
  }
  const fetchUserRepos = async (username) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const reposData = await response.json();
      setRepos(reposData);
      const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
      setStarCount(totalStars);
    } catch (error) {
      console.error('Ошибка при получении репозиториев:', error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserRepos(selectedUser.login);
    }
  }, [selectedUser]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true); 
  };

  const handleUserSelect = async (user) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PAGE_URL}users/${user.login}`);

      if (!response.ok) {
        throw new Error('Не удалось получить данные о пользователе');
      }

      const userDetails = await response.json();
      setSelectedUser(userDetails); 
      setShowDropdown(false); 
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="Github">
      <header className='header'>
        <nav className='nav'>
          <h1 className='nav__title'>GITHUB FINDER</h1>
        </nav>
      </header>
      <main>
        <div className="search" ref={dropdownRef}>
          <input
            type="text"
            className='search__input'
            placeholder='Введите имя пользователя'
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          
          {showDropdown && filteredUsers.length > 0 && (
            <div className='dropdown'>
              <ul className='dropdown-list'>
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    className='dropdown-item'
                    onClick={() => handleUserSelect(user)}
                  >
                    <img 
                      src={user.avatar_url} 
                      alt={user.login} 
                      className='avatar-icon' 
                    />
                    {user.login}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {loading && <p>Загрузка пользователей...</p>}

        {selectedUser && (
          <div className="user-info">
            <div className="user__img">
              <a href={selectedUser.html_url} target="_blank" rel="noopener noreferrer">
                <button className='visit-button'>Посетить</button>
              </a>
              <img
                src={selectedUser.avatar_url}
                alt={selectedUser.login}
                className="user-avatar"
              />
            </div>
            <div className="user-details">
              <h3>{selectedUser.login}</h3>
              <p className='user-detal-list'> <p className='user-title'> Репозитории:</p> {selectedUser.public_repos} </p>
              <p className='user-detal-list'> <p className='user-title'>Создан:</p> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              <p className='user-detal-list'> <p className='user-title'>Подписчиков:</p>{selectedUser.followers}</p>
              <p className='user-detal-list'> <p className="user-title">Подписок: </p>  {selectedUser.following}</p>
            </div>
          </div>
        )}
      </main>
      <div className="main__nav">
        <h4 className='main__nav-title'>Сортировка</h4>
      </div>
      <div className="main__nav-links">
        <p className="main__link" onClick={()=> handleSortChange("name")}>ИМЯ</p>
        <p className="main__link" onClick={()=> handleSortChange("stars")}>ЗВЕЗДЫ</p>
        <p className="main__link" onClick={()=> handleSortChange("date")}>ДАТА</p>
      </div>

      {repos.length > 0 && (
        <div className="repos-container">
         {repos.map((repo) => (
  <div key={repo.id} className="repos">
    <div className="repos__items">
      <h2 className="repos__title">
        {sortBy === 'stars' ? repo.stargazers_count : sortBy === 'date' ? new Date(repo.created_at).toLocaleDateString() : repo.name}
      </h2>
      <h5 className="repos__stars">
        {sortBy === 'name' ? repo.stargazers_count : sortBy === 'date' ? repo.name : repo.stargazers_count}
      </h5>
      <p className="repos__add">
        {sortBy === 'date' ? repo.created_at : 'Дата добавления: ' + new Date(repo.created_at).toLocaleDateString()}
      </p>
    </div>
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
      <button className="visit-button">Посетить</button>
    </a>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default Github;
