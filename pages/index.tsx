import type { NextPage } from 'next'
import { AppBar, Container, Typography, Toolbar } from '@mui/material';

const Home: NextPage = () => {
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            image-app-express
          </Typography>
        </Toolbar>
      </AppBar>
    </Container>
  )
}

export default Home
