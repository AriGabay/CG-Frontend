import './Menu.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Controls from '../../Controls/Controls';
import { isMenuEnableService } from '../../../services/isMenuEnableService';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
const useStyles = makeStyles(() => ({
  gridTag: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column!important'
  },
  marginTop: {
    marginTop: '10px!important'
  }
}));


export const Menu = () => {
  const classes = useStyles();
  const [menus,setMenus]=useState([]);
  const [isWeekend,setIsWeekend]=useState(null);
  const [isPesach,setIsPesach]=useState(null);
  const [isTishray,setIsTishray]=useState(null);

  const getAllMenus=async()=>{
    const res = await isMenuEnableService.getAllMenus();
    console.log('res',res);
    setMenus(res);
  };
  
  useEffect(()=>{
    getAllMenus();
  },[]);
  
  const changeMenu=(menu)=>{
    if(menu.name==='weekend'){
      setIsWeekend(menu.value);
    }else if(menu.name==='pesach'){
      setIsPesach(menu.value);
    }else if(menu.name==='tishray'){
      setIsTishray(menu.value);
    }
  };
  const updateMenu=async()=>{
    if(typeof isWeekend==='boolean'){
      await isMenuEnableService.setMenuEnable({menuType:'weekend',enable:isWeekend});
    }
    if(typeof isPesach==='boolean'){
      await isMenuEnableService.setMenuEnable({menuType:'pesach',enable:isPesach});
    }
    if(typeof isTishray==='boolean'){
      await isMenuEnableService.setMenuEnable({menuType:'tishray',enable:isTishray});
    }
  };

 
  return (
    <Grid>
      {menus.length>0&&
      <Grid className={classes.gridTag}>
        <Typography variant="h5">עדכון תפריט</Typography>
        {menus.map((menu)=>{
          return <div key={menu.id}>
            <Controls.Checkbox name={menu.menuType} value={!!menu.enable} label={menu.menuType} onChange={(event)=>changeMenu(event.target)}></Controls.Checkbox>
          </div>;
        })}
        <Controls.Button text={'עדכן'} onClick={()=>updateMenu()}></Controls.Button>
       </Grid>}
    </Grid>
  );
};
