import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

export default function LabelBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState('home');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label="Recents" value="home" icon={<HomeOutlinedIcon />} />
      <BottomNavigationAction label="Favorites" value="search" icon={<SearchOutlinedIcon />} />
      <BottomNavigationAction label="Nearby" value="profile" icon={<PersonOutlineOutlinedIcon />} />
      <BottomNavigationAction label="Folder" value="menu" icon={<MenuIcon />} />
    </BottomNavigation>
  );
}
