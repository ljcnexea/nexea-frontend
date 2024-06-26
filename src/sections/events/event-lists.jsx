/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/no-unresolved */

import axios from 'axios';
import dayjs from 'dayjs';
//  import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Form, Field, Formik, ErrorMessage } from 'formik';
import EditIcon from '@mui/icons-material/Edit';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Grid,
  Card,
  Stack,
  Button,
  Dialog,
  Select,
  Avatar,
  Divider,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  CardActions,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { popover } from 'src/theme/overrides/components/popover';
import { fDate } from 'src/utils/format-time';

const EventStatus = {
  live: 'live',
  scheduled: 'scheduled',
  completed: 'completed',
  postponed: 'postponed',
};

// const TestCard = styled(Card)(({ theme }) => ({
//   position: 'relative',
//   overflow: 'visible', // Make sure the overflow is visible to show the blurred image
//   borderRadius: 8, // Adjust as per your preference
//   boxShadow: 'none', // You can add box-shadow if desired
//   backgroundBlendMode: 'overlay',
//   backgroundImage: 'url(https://api.slingacademy.com/public/sample-photos/1.jpeg)',
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     top: 0,
//     left: 0,
//     backgroundImage: (props) => `url(${props.backgroundImage}`,
//     backgroundImage: 'url(https://api.slingacademy.com/public/sample-photos/1.jpeg)',
//     ilter: 'blur(10px)', // Adjust the blur intensity as needed
//     backgroundSize: 'cover',
//     backgroundRepeat: 'no-repeat',
//     zIndex: 1111, // Ensure the blurred background stays behind the content
//   },
// }));

const EventLists = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // State to store users data
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/event/events'); // remove/add /api if it doesnt work
      const eventsArray = response.data.events;
      setEvents(eventsArray);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users data from user API
        const response = await fetch('http://localhost:3001/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchEvents();
    fetchUsers();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleIcon = () => {
    setIsEditing(!isEditing);
  };
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
  };

  return (
    <>
      <Box
        display="grid"
        gap={3}
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        marginTop={5}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          events.map((event) => (
            <Card
            // sx={{
            //   width: '100%',
            //   display: 'flex',
            //   flexDirection: 'column',
            //   justifyContent: 'space-between',
            // }}
            // key={event.id}
            // variant="outlined"
            >
              <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
              <Stack sx={{ p: 3, pb: 2 }}>
                <Avatar
                  alt="test"
                  src="/logo/logo_single.svg"
                  variant="rounded"
                  sx={{ width: 48, height: 48, mb: 2 }}
                />
                <ListItemText
                  sx={{ mb: 1 }}
                  primary={
                    <Typography fontWeight={900} variant="h4">
                      {event.name}
                    </Typography>
                  }
                  secondary={`Posted date: ${fDate(Date.now())}`}
                  primaryTypographyProps={{
                    typography: 'subtitle1',
                  }}
                  secondaryTypographyProps={{
                    mt: 1,
                    component: 'span',
                    typography: 'caption',
                    color: 'text.disabled',
                  }}
                />

                <Stack
                  spacing={0.5}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'primary.main', typography: 'caption' }}
                >
                  <Iconify width={16} icon="solar:users-group-rounded-bold" />
                  {12} Attendees
                </Stack>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />

              <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
                <Stack
                  spacing={0.5}
                  flexShrink={0}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'text.disabled', minWidth: 0 }}
                >
                  <Iconify icon="mdi:user" />
                  <Typography variant="caption" noWrap>
                    {`${event.personInCharge.name
                      .charAt(0)
                      .toUpperCase()}${event?.personInCharge?.name.slice(1)}`}
                  </Typography>
                </Stack>
                <Stack
                  spacing={0.5}
                  flexShrink={0}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'text.disabled', minWidth: 0 }}
                >
                  <Iconify icon="mdi:calendar" />
                  <Typography variant="caption" noWrap>
                    {dayjs(event.date).format('LL')}
                  </Typography>
                </Stack>
              </Box>
              <CardActions
                sx={{
                  marginTop: 0,
                  paddingRight: 3,
                  paddingLeft: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                {/* <Typography> {dayjs(event.date).format('DD-MMM-YYYY')} </Typography> */}
                {/* MODAL */}
                <Dialog
                  sx={{
                    '& .MuiDialog-paper': {
                      width: { xs: '90%', sm: '50%', md: '40%' }, // Adjust width for different screen sizes
                      maxWidth: '500px',
                      height: 'auto', // Adjust height to auto to prevent squashing
                      overflow: 'auto', // Enable scrolling if content overflows
                    },
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <DialogTitle
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {event.name}
                    <IconButton onClick={handleIcon} edge="end">
                      <EditIcon />
                    </IconButton>
                  </DialogTitle>

                  <DialogContent dividers sx={{ padding: 2 }}>
                    {/* Editing View */}
                    {isEditing ? (
                      <Formik
                        initialValues={{
                          name: event.name,
                          description: event.description,
                          date: event.date,
                          personInCharge: event.personInCharge.name,
                          tickera_api: event.tickera_api,
                          status: event.status,
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                          axios
                            .put(`http://localhost:3001/event/update/${event.id}`, values) // remove/add /api if it doesnt work
                            .then((response) => {
                              //  alert(JSON.stringify(response.data, null, 2));
                              setSubmitting(false);
                              fetchEvents();
                              toast.success('Event updated successfully!');
                            })
                            .catch((error) => {
                              console.error('Error updating event:', error);
                              setSubmitting(false);
                              toast.error('Update Failed, Try again!');
                            });
                        }}
                      >
                        {({ isSubmitting, setFieldValue, values }) => (
                          <Form>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Field
                                  as={TextField}
                                  type="text"
                                  name="name"
                                  label="Event Name"
                                  fullWidth
                                  required
                                />
                                <ErrorMessage name="name" component="div" />
                              </Grid>

                              <Grid item xs={6}>
                                <Field
                                  as={TextField}
                                  select
                                  name="personInCharge"
                                  label="Person in Charge"
                                  fullWidth
                                  required
                                >
                                  <MenuItem value="">Select Person in Charge</MenuItem>
                                  {loading ? (
                                    <MenuItem disabled>Loading...</MenuItem>
                                  ) : (
                                    users.map((user) => (
                                      <MenuItem key={user.id} value={user.id}>
                                        {user.name}
                                      </MenuItem>
                                    ))
                                  )}
                                </Field>
                                <ErrorMessage name="personInCharge" component="div" />
                              </Grid>

                              <Grid item xs={12}>
                                <Field
                                  as={TextField}
                                  type="text"
                                  name="description"
                                  label="Event Description"
                                  fullWidth
                                />
                                <ErrorMessage name="description" component="div" />
                              </Grid>

                              <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DatePicker
                                    selected={values.date}
                                    onChange={(date) => setFieldValue('date', date)}
                                    className="form-control"
                                    required
                                  />
                                </LocalizationProvider>
                                <ErrorMessage name="date" component="div" />
                              </Grid>

                              <Grid item xs={6}>
                                <Field
                                  as={TextField}
                                  type="text"
                                  name="api"
                                  label="Tickera API"
                                  fullWidth
                                  required
                                />
                                <ErrorMessage name="api" component="div" />
                              </Grid>

                              <Grid item xs={8}>
                                <Field
                                  as={Select}
                                  name="status"
                                  label="Event Status"
                                  fullWidth
                                  required
                                >
                                  {Object.values(EventStatus).map((status) => (
                                    <MenuItem key={status} value={status}>
                                      {status}
                                    </MenuItem>
                                  ))}
                                </Field>
                                <ErrorMessage name="status" component="div" />
                              </Grid>

                              <Grid item xs={6}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="secondary"
                                  onClick={handleIcon}
                                  disabled={isSubmitting}
                                  fullWidth
                                >
                                  Back
                                </Button>
                              </Grid>

                              <Grid item xs={6}>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="primary"
                                  disabled={isSubmitting}
                                  fullWidth
                                >
                                  Submit
                                </Button>
                              </Grid>
                            </Grid>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <>
                        <Typography gutterBottom>Description: {event.description}</Typography>
                        <Typography gutterBottom>
                          Person in Charge: {event.personInCharge.name}
                        </Typography>
                        <Typography gutterBottom>
                          Date: {dayjs(event.date).format('DD-MMM-YYYY')}
                        </Typography>
                        {/* <Typography gutterBottom>
                        Tickera API: {event.tickera_api}
                      </Typography> */}
                        <Typography gutterBottom>Status: {event.status}</Typography>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          height="100%"
                          marginTop={5}
                        >
                          <Button type="submit" variant="contained" color="primary">
                            Open QR Scanner
                          </Button>
                        </Box>
                      </>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                  </DialogActions>
                </Dialog>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClickOpen}
                  fullWidth
                  sx={{
                    marginY: 2,
                  }}
                >
                  View Event
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Box>

      <Pagination
        count={3}
        sx={{
          mt: 8,
          [`& .${paginationClasses.ul}`]: {
            justifyContent: 'center',
          },
        }}
      />
    </>
  );
};

export default EventLists;
// TestCard.propTypes = {
//   backgroundImage: PropTypes.string.isRequired,
// };
