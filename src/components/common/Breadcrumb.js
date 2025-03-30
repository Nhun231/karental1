import { Breadcrumbs, Link, List, ListItem, Typography } from '@mui/material'
import React from 'react'

const Breadcrumb = ({ listData = [] }) => {

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2, }}>
        {listData.map((item, index) =>
          index !== listData.length - 1 ? (
            <Link key={index} color="inherit" href={item.link} underline="hover">
              {item.name}
            </Link>
          ) : (
            <Typography key={index} color="text.primary">
              {item.name}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </>
  )
}

export default Breadcrumb