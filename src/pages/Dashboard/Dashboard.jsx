import React from 'react'
import { queryClient } from '../../app/queryClient';

const Dashboard = () => {

  const initData = queryClient.getQueryData(["initData", {}]);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard