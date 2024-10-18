import React, { useState, useEffect } from 'react';

const useGithubUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchUsers = async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_PAGE_URL}users?per_page=100&page=${page}`);

      if (response.status === 401) {
        throw new Error('Unauthorized: Check your access token');
      }

      const result = await response.json();

      if (result.length > 0) {
        setUsers((prevUsers) => [...prevUsers, ...result]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      if (searchQuery.length > 0) {
        const filtered = users.filter((user) =>
          user.login.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }
  }, [searchQuery, users]);

  return { searchQuery, setSearchQuery, filteredUsers, loading };
};

export default useGithubUsers;
