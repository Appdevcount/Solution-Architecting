/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css'; 
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthProvider';
import config from '../config/config';
import { RootState } from '../state/store/store';
import Logo from '../assets/Logo.png';

const Sidebar: React.FC = () => {


    const menuList = config.menuListAndPermissions;

    const { handleLogout } = useAuth();
    const [loading, setLoading] = useState(true);

    const currentUser = useSelector((state: RootState) => state.auth.user);
    useEffect(() => {
        if (currentUser !== undefined) {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <div>Loading...</div>;
    }
    interface MenuItem {
        to: string;
        label: string;
        roles: string[];
    }

    let permittedMenuList: MenuItem[] = [];
    if (!currentUser) {
        permittedMenuList = menuList.filter((item: { roles: string[]; }) => item.roles.includes(""));
    }
    else {
        permittedMenuList = menuList.filter((item: { roles: string[]; }) => item.roles.some((role: string) => currentUser.roles.includes(role)));
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img
                    src={Logo}
                    alt="eviCore Healthcare Logo"
                    className={styles.logo}
                />
            </div>

            <div className={styles.menu}>
                {permittedMenuList.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className=""
                        style={({ isActive }) => ({ borderColor: isActive ? 'white !important' : 'black  !important' })}
                    >
                        {item.label}
                    </NavLink>
                ))}
               {currentUser && <button className={styles.logoutButton} onClick={()=>handleLogout()} >Logout</button>}
            </div>

        </div>
    );
};

export default Sidebar;
