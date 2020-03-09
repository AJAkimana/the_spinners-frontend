import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Badge, Button, IconButton, Toolbar, Hidden, colors } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import socketIOClient from 'socket.io-client';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import BarefootLogo from '../../../public/images/logos/barefoot-logo.svg';

import http from '../../services/httpService';
import NotificationsPopover from '../Notification/NotificationsPopover';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexGrow: 1,
		textAlign: 'center'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: '#0074D9'
	},
	flexGrow: {
		flexGrow: 1
	},
	notificationsButton: {
		marginLeft: theme.spacing(1)
	},
	notificationsBadge: {
		backgroundColor: colors.orange[600]
	},
	logoutButton: {
		marginLeft: theme.spacing(1)
	},
	logoutIcon: {
		marginRight: theme.spacing(1)
	}
}));
function Alert(props) {
	return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const TopBar = props => {
	const classes = useStyles();
	const notificationsRef = useRef(null);
	const [notifications, setNotifications] = useState([]);
	const [unreadNotifications, setUnreadNotifications] = useState(0);
	const [openNotifications, setOpenNotifications] = useState(false);
	const [open, setOpen] = React.useState(false);
	const [snackBarMessage, setSnackBarMessage] = useState('');

	const endPoint = `${process.env.API_URL}`;

	const connect = () => {
		const token = localStorage.getItem('token');
		const socket = socketIOClient(endPoint);

		socket.on('connect', () => {
			socket
				.emit('authenticate', { token }) // send the jwt
				.on('authenticated', () => {
					socket.on('success', userData => {
						socket.emit('new-user', userData);
					});
					socket.on('new-notification', data => {
						setNotifications(prev => [...prev, data]);
						setUnreadNotifications(prevUnread => prevUnread + 1);
						setSnackBarMessage(data.message);
						setOpen(true);
					});
				});
		});
	};
	useEffect(() => {
		let mounted = true;

		const fetchNotifications = () => {
			http.get('/api/notifications').then(response => {
				if (mounted) {
					response.data.data.notifications.map(notification => {
						setNotifications(prev => [...prev, notification]);
					});
					setUnreadNotifications(response.data.data.unread);
				}
			});
		};

		fetchNotifications();
		setInterval(connect(), 1000);

		return () => {
			mounted = false;
		};
	}, []);
	let sortedNotifications = notifications;
	if (notifications.length > 0) {
		// sort notification by created date
		sortedNotifications = notifications
			.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
			.reverse();
	}
	const handleNotificationsOpen = () => {
		setOpenNotifications(true);
	};

	const handleNotificationsClose = () => {
		setOpenNotifications(false);
	};
	const markAllAsRead = () => {
		http.patch('/api/notifications/mark-all-as-read').then(() => {
			setUnreadNotifications(prevUnread => prevUnread * 0);
		});
	};
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<Snackbar
				open={open}
				autoHideDuration={10000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert severity='info' id='feedback' onClose={handleClose}>
					{snackBarMessage}
				</Alert>
			</Snackbar>
			<AppBar className={classes.appBar} color='primary'>
				<Toolbar>
					<RouterLink to='/'>
						<img alt='Logo' src={BarefootLogo} />
					</RouterLink>
					<div className={classes.flexGrow} />
					<Hidden smDown>
						<IconButton
							className={classes.notificationsButton}
							color='inherit'
							onClick={handleNotificationsOpen}
							ref={notificationsRef}
						>
							<Badge
								badgeContent={unreadNotifications}
								classes={{ badge: classes.notificationsBadge }}
								max={50}
							>
								<NotificationsIcon />
							</Badge>
						</IconButton>
						<Button
							className={classes.logoutButton}
							color='inherit'
							onClick={() => props.handleLogout()}
						>
							<InputIcon className={classes.logoutIcon} />
							Sign out
						</Button>
					</Hidden>
					<Hidden smUp>
						<IconButton color='inherit' onClick={() => props.handleDrawerToggle()}>
							<MenuIcon />
						</IconButton>
					</Hidden>
				</Toolbar>

				<NotificationsPopover
					anchorEl={notificationsRef.current}
					notifications={sortedNotifications}
					unreadNotifications={unreadNotifications}
					markAllAsRead={markAllAsRead}
					onClose={handleNotificationsClose}
					open={openNotifications}
				/>
			</AppBar>
		</div>
	);
};

export default TopBar;
