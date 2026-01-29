import React from 'react';
import { Box, Card, Chip, IconButton, Typography, TextField } from '@mui/material';
import { DragIndicator, Delete, Check, Close, Timer } from '@mui/icons-material';
import axios from 'axios';

const Timeline = ({
	items,
	onSelect,
	onRemove,
	onReorder,
	selectedId,
	onDropFromLibrary,
	onEditDuration,
}) => {
	const token = localStorage.getItem("authToken");
	const [draggedId, setDraggedId] = React.useState(null);
	const [editing, setEditing] = React.useState({ id: null, value: '' });

	const handleDragStart = (e, id) => {
		setDraggedId(id);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDropOnItem = (e, targetId) => {
		e.preventDefault();
		if (!draggedId || draggedId === targetId) return;
		const fromIndex = items.findIndex((i) => i.id === draggedId);
		const toIndex = items.findIndex((i) => i.id === targetId);
		if (fromIndex < 0 || toIndex < 0) return;
		const newItems = [...items];
		const [removed] = newItems.splice(fromIndex, 1);
		newItems.splice(toIndex, 0, removed);
		onReorder(newItems.map((it, idx) => ({ ...it, position: idx })));
		setDraggedId(null);
	};

	const handleDropFromLibrary = (e) => {
		e.preventDefault();
		try {
			let payload = e.dataTransfer.getData('application/library-item');
			if (!payload) payload = e.dataTransfer.getData('text/plain');
			if (payload && onDropFromLibrary) {
				const item = JSON.parse(payload);
				onDropFromLibrary(item);
			}
		} catch (_) {}
	};

	const handleDurationUpdate = async (id, newDuration) => {
		try {
			const form = new FormData();
			form.append('action', 'update');
			form.append('id', String(id));
			form.append('ad_time', String(newDuration));
			
			const res = await axios.post('advertisment.php', form, { 
				headers: { Authorization: token } 
			});
			
			if (res.data?.res === 'true') {
				onEditDuration && onEditDuration(id, newDuration);
			} else {
				console.error('Failed to update duration:', res.data.res);
			}
		} catch (error) {
			console.error('Duration update error:', error);
		}
	};

	return (
		<Box sx={{ overflowX: 'auto', overflowY: 'hidden' }} onDragOver={handleDragOver} onDrop={handleDropFromLibrary}>
			<Box sx={{ display: 'flex', gap: 2, pb: 2 }}>
				{items.map((item) => (
					<Card
						key={item.id}
						draggable
						onDragStart={(e) => handleDragStart(e, item.id)}
						onDragOver={handleDragOver}
						onDrop={(e) => handleDropOnItem(e, item.id)}
						onClick={() => onSelect && onSelect(item)}
						sx={{
							minWidth: 220,
							width: 260,
							height: 140,
							cursor: 'pointer',
							border: selectedId === item.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
							transition: 'all 0.2s ease',
							'&:hover': { transform: 'translateY(-1px)', boxShadow: 2 },
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						{/* Background media */}
						{/* Background image/video */}
						{item.type === 'video' ? (
							<Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
								<video
									src={item.image}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										filter: 'brightness(0.85)'
									}}
									muted
									loop
									playsInline
								/>
							</Box>
						) : (
							<Box
								sx={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundImage: item.imageForCSS || `url(${item.image})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									filter: 'brightness(0.85)'
								}}
							/>
						)}

						{/* Order number - top center */}
						<Box sx={{ 
							position: 'absolute', 
							top: 8, 
							left: '50%', 
							transform: 'translateX(-50%)',
							zIndex: 2
						}}>
							<Chip 
								label={`#${item.position + 1}`} 
								size="small" 
								sx={{ 
									backgroundColor: 'rgba(0,0,0,0.7)', 
									color: 'white',
									fontWeight: 600,
									fontSize: '0.7rem',
									height: 20
								}} 
							/>
						</Box>

						{/* Top bar: drag + type chip + delete */}
						<Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', p: 1 }}>
							<DragIndicator sx={{ color: 'white', mr: 1, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
							<Chip label={item.type} size="small" sx={{ color: 'white', bgcolor: item.type === 'video' ? '#ef4444' : '#3b82f6' }} />
							<Box sx={{ ml: 'auto' }}>
								<IconButton 
									size="small" 
									onClick={(e) => { e.stopPropagation(); onRemove && onRemove(item.id); }} 
									sx={{ 
										color: 'white',
										backgroundColor: 'rgba(239, 68, 68, 0.9)',
										'&:hover': {
											backgroundColor: 'rgba(220, 38, 38, 1)',
											transform: 'scale(1.1)'
										},
										transition: 'all 0.2s ease',
										width: 28,
										height: 28
									}}
								>
									<Delete fontSize="small" />
								</IconButton>
							</Box>
						</Box>

						{/* Bottom bar: name + duration (editable) */}
						<Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, p: 1.2, display: 'flex', alignItems: 'center', gap: 1, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)' }}>
							<Typography variant="body2" sx={{ flex: 1, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
								{item.name}
							</Typography>
							{editing.id === item.id ? (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<TextField
										size="small"
										value={editing.value}
										onChange={(e) => setEditing({ id: item.id, value: e.target.value })}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											const newVal = parseInt(editing.value) || item.duration;
											handleDurationUpdate(item.id, newVal);
											setEditing({ id: null, value: '' });
										}
									}}
										sx={{ width: 64 }}
										inputProps={{ style: { fontSize: '0.75rem', padding: '4px 8px' } }}
									/>
									<IconButton size="small" sx={{ color: '#10b981' }} onClick={() => { const newVal = parseInt(editing.value) || item.duration; handleDurationUpdate(item.id, newVal); setEditing({ id: null, value: '' }); }}>
										<Check fontSize="small" />
									</IconButton>
									<IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => setEditing({ id: null, value: '' })}>
										<Close fontSize="small" />
									</IconButton>
								</Box>
							) : (
								<Box 
									sx={{ 
										display: 'flex', 
										alignItems: 'center', 
										gap: 0.5, 
										color: 'white',
										cursor: 'pointer',
										'&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }
									}}
									onClick={(e) => {
										e.stopPropagation();
										setEditing({ id: item.id, value: item.duration.toString() });
									}}
								>
									<Timer fontSize="small" />
									<Typography variant="caption">{item.duration}s</Typography>
								</Box>
							)}
						</Box>
					</Card>
				))}
			</Box>
		</Box>
	);
};

export default Timeline;
