import React from 'react'
import { queryClient } from '../../app/queryClient';

const Dashboard = () => {

  const  initData = queryClient.getQueryData(["initData", "authenticated"]);

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard