import React from 'react'
import { queryClient } from '../../app/queryClient';

const Dashboard = () => {

  const initData = queryClient.getQueryData(["initData", {}]);
console.log(initData,"initdata"); // only state.data

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard