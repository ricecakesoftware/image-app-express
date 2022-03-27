import { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { AppBar, Card, Container, Typography, Toolbar } from '@mui/material';

const Images : NextPage = () => {
  const [socket, _] = useState(() => io());
  const [src, setSrc] = useState('')
  const router = useRouter()
  const query = router.query
  useEffect(() => {
    if (router.isReady) {
      const event = 'image_' + query.id
      socket.on(event, (data) => {
        setSrc('data:image/png;base64,' + data.base64)
      })
    }
  }, [router, query])
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            image-app-express
          </Typography>
        </Toolbar>
      </AppBar>
      <Card>
        <img src={src} />
      </Card>
    </Container>
  )
}

export default Images
