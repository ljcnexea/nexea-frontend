/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { DataGrid, GridToolbar, useGridApiRef } from '@mui/x-data-grid';
import {
  Box,
  Alert,
  Dialog,
  Button,
  Select,
  Snackbar,
  MenuItem,
  Container,
  Typography,
  DialogTitle,
  DialogContent
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CreateAttendeeForm from 'src/components/modalAdd/attendeeform';

// ----------------------------------------------------------------------

export default function Attendees() {
  const settings = useSettingsContext();
  //  const [checkAll, setCheckAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [attendees, setAttendees] = useState([]);
 // const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const apiRef = useGridApiRef();
  const [menuOptions, setMenuOptions] = useState([]);
  // To select the event in the menu item 
  const [selectedEvent, setSelectedEvent] = useState('');
  // To filter to attendees data when an event is selected 
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [allAttendees, setAllAttendees] = useState([]);


  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:3001/event/events'); // Add/remove /api if it doesnt work
      const eventsArray = response.data.events;
      const options = eventsArray.map(event => ({
        value: event.id, 
        label: event.name,
      }));
      setMenuOptions(options);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
 };

 const fetchAttendees = async () => {
  try {
    const response = await axiosInstance.get('/api/attendees');
    setAllAttendees(response.data);
  } catch (error) {
    // console.error('Error fetching all attendees:', error);
  }
};

 const handleMenuSelect = (event) => {
    const eventId = event.target.value;
    const selectedEventName = menuOptions.find(option => option.value === eventId)?.label;
    setSelectedEvent(selectedEventName);
    //  setSelectedEvent(selectedEvent);
    setSelectedEventId(eventId);
    console.log("Selected Event:", eventId);
 };

 useEffect(() => {
  if (selectedEventId) {
     const attendeesForSelectedEvent = allAttendees.filter(attendee => attendee.eventId === selectedEventId);
     setAttendees(attendeesForSelectedEvent);
  }
 }, [selectedEventId, allAttendees]); 

   
   
  // // Filter attendees based on the selected event ID
  // const attendeesForSelectedEvent = attendees.filter(attendee => attendee.eventId === selectedEvent);
  // setAttendees(attendeesForSelectedEvent);
 
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  

  const updateAttendees = useCallback(
    async (newRow) => {
      try {
        await axiosInstance.patch(`/api/attendee/update/${newRow.id}`, newRow); // Add/remove /api if it doesnt work
        fetchAttendees();
        setSnackbar({ children: 'User successfully saved', severity: 'success' });
        return newRow;
      } catch (error) {
        console.error('Error fetching attendees:', error);
      }
    },
    []
  );

  const handleProcessRowUpdateError = useCallback((error) => {
    setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   fetchEvents();
  //   return () => {
  //     controller.abort();
  //   };
  // }, []);

  useEffect(() => {
    fetchAttendees();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchEvents();
    fetchAttendees();
    return () => {
      controller.abort();
    };
  }, []);

  // Ajust the width  or use the slide to give more screen realestate
  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'firstName', headerName: 'First Name', width: 120, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 120, editable: true },
    { field: 'name', headerName: 'Name', width: 120 },
    { field: 'orderNumber', headerName: 'Order Number' },
    { field: 'ticketTotal', headerName: 'Ticket Total' },
    { field: 'discountCode', headerName: 'Discount Code' },
    { field: 'ticketCode', headerName: 'Ticket Code' },
    { field: 'ticketID', headerName: 'Ticket ID' },
    { field: 'ticketType', headerName: 'Ticket Type' },
    { field: 'buyerFirstName', headerName: 'Buyer First Name', width: 120, editable: true },
    { field: 'buyerLastName', headerName: 'Buyer Last Name', width: 120, editable: true },
    { field: 'buyerEmail', headerName: 'Buyer Email', width: 120, editable: true },
    { field: 'phoneNumber', headerName: 'Phone Number', editable: true },
    { field: 'companyName', headerName: 'Company Name', editable: true },
    { field: 'attendance', headerName: 'Attendance'},
  ];

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ marginBottom: 4 }}>
        <Typography variant="h4">Attendees</Typography>
      </Container>

      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ marginBottom: 4 }}>
        <div key={selectedEventId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
          > */}
          <Select
            value={selectedEvent}
            onChange={handleMenuSelect}
            variant="outlined"
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography variant="body2" color="textSecondary">
                    Select Event
                  </Typography>
                );
              }
              return selected;
            }}
          >
            <MenuItem disabled value="">
              <em>Select Event</em>
            </MenuItem>
            {menuOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

            <Button onClick={handleModalOpen} endIcon={<Iconify icon="material-symbols:add" />}>
              Create
            </Button>
        </div>

        <Dialog open={isModalOpen} onClose={handleModalClose}>
          <DialogTitle> Add Attendee Information</DialogTitle>
          <DialogContent sx={{ py: 4 }}>
            <CreateAttendeeForm setIsModalOpen={setIsModalOpen} fetchAttendees={fetchAttendees} selectedEventId={selectedEventId} />
          </DialogContent>
        </Dialog>
      </Container>

       {/* Attendees Table  */}
       {selectedEvent ? (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            editMode="row"
            apiRef={apiRef}
            rows={attendees.filter(attendee => attendee.eventId === selectedEventId)}// Filtered attendees based on selected event
            columns={columns}
            pagination
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
            selectionModel={selectedRows}
            onPageChange={(newPage) => setPage(newPage)}
            autoHeight
            processRowUpdate={(newRow, oldRow) => {
              if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
                return oldRow;
              }
              return updateAttendees(newRow);
            }}                  
            onProcessRowUpdateError={handleProcessRowUpdateError}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              onClose={() => setSnackbar(null)}
              autoHideDuration={6000}
            >
              <Alert icon={<CheckIcon fontSize="inherit" />} {...snackbar} />
            </Snackbar>
          )}
        </Box>
      ) : (
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh', // Adjust height as needed
        }}
      >
        <Typography>Please Select an event to display Attendees</Typography>
      </Box>
      )}
    </>
  );
}
