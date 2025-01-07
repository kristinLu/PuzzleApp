import { useState } from 'react';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppBar, CssBaseline, Tab, Tabs, ThemeProvider, createTheme } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HouseIcon from '@mui/icons-material/House';
import InventoryIcon from '@mui/icons-material/Inventory';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Archive from './components/Archive';
import BarcodeSearch from './components/BarcodeSearch';
import ConfirmationDialog from './components/ConfirmationDialog';
import DetailedView from './components/DetailedView';
import Form from './components/Form';
import Home from './components/Home';
import MyCollection from './components/MyCollection';
import Wishlist from './components/Wishlist';
import { DialogProvider } from './components/DialogContext';

const theme = createTheme({
  palette: {
    primary: { main: '#00bfa5', contrastText: '#FFFFFF' },
    secondary: { main: '#6d4c41', contrastText: '#FFFFFF' },
    text: { primary: '#00897b', secondary: '#7c4dff' },
  },
  typography: {
    fontFamily: "'Raleway'",
    h4: {
      fontFamily: "'Audiowide'",
      lineHeight: 2.6,
      color: "#7c4dff"
    },
    button: {
      fontFamily: "'Audiowide'",
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (e, val) => { setActiveTab(val) }

  return (
    <ThemeProvider theme={theme}>
      <DialogProvider>
        <CssBaseline />
        <Router>
          <AppBar position='static'>
            <Tabs textColor='inherit' variant='fullWidth' value={activeTab} onChange={handleChange}>
              <Tab label='HOME' icon={<HouseIcon />} component={Link} to='/' />
              <Tab label='ADD' icon={<LibraryAddIcon />} component={Link} to='add' />
              <Tab label='BARCODE SEARCH' icon={<SearchRoundedIcon />} component={Link} to='barcodesearch' />
              <Tab label='MY COLLECTION' icon={<ExtensionIcon />} component={Link} to='collection' />
              <Tab label='WISHLIST' icon={<FavoriteIcon />} component={Link} to='wishlist' />
              <Tab label='ARCHIVE' icon={<InventoryIcon />} component={Link} to='archive' />
            </Tabs>
          </ AppBar>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='add' element={<Form setActiveTab={handleChange} />} />
            <Route path='barcodesearch' element={<BarcodeSearch setActiveTab={handleChange} />} />
            <Route path='collection' element={<MyCollection />} />
            <Route path='wishlist' element={<Wishlist />} />
            <Route path='archive' element={<Archive />} />
            <Route path='detailedview' element={<DetailedView />} />
            <Route path='*' element={<Home />} />
          </Routes>
        </Router>
        <ConfirmationDialog />
      </DialogProvider>
    </ThemeProvider>
  )
}

export default App
