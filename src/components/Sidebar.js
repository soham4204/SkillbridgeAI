import React, { useState } from "react";
import {
    Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip
} from "@mui/material";
import { Menu, Dashboard, Group, Work, PostAdd, ManageAccounts, ExitToApp } from "@mui/icons-material";

const Sidebar = ({ setActivePage }) => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => setOpen(!open);
    
    const menuItems = [
        { text: "My Profile", icon: <ManageAccounts />, page: "profile" },
        { text: "Dashboard", icon: <Dashboard />, page: "dashboard" },
        { text: "Applied candidates", icon: <Group />, page: "job-listings" },
        { text: "Post a Job", icon: <PostAdd />, page: "post-job" },
        { text: "Manage Jobs", icon: <Work />, page: "manage-jobs" },
        { text: "Log Out", icon: <ExitToApp />, page: "/" }
    ];
    
    return (
        <Drawer
            variant="permanent"
            sx={{ width: open ? 240 : 70, flexShrink: 0, "& .MuiDrawer-paper": { width: open ? 240 : 70, transition: "width 0.3s", backgroundColor: "#e8f3d6", boxShadow: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: open ? "flex-end" : "center", p: 1 }}>
                <IconButton onClick={toggleDrawer}><Menu /></IconButton>
            </Box>
            <List>
                {menuItems.map(({ text, icon, page }) => (
                    <Tooltip title={open ? "" : text} placement="right" key={text}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setActivePage(page)} sx={{ borderRadius: "8px", m: 1, "&.Mui-selected": { backgroundColor: "#cfe8fc" }, "&:hover": { backgroundColor: "#d6eaf8" } }}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                {open && <ListItemText primary={text} />}
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar