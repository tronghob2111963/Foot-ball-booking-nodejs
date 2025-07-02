<template>
  <div class="reservation-form">
    <h2>Reservation Form</h2>
    <form
      @submit.prevent="submitReservation"
      class="form-container"
    >
      <label for="fieldId">Field ID:</label>
      <div class="field-id-container">
        <input
          type="text"
          v-model="fieldId"
          id="fieldId"
          @input="onFieldIdInput"
          required
          class="input-field"
        />
        <span
          v-if="fieldStatus"
          class="field-status"
        >
          {{ fieldStatus }}
        </span>
      </div>
      <label for="userPhone">Phone Number:</label>
      <input
        type="text"
        v-model="userPhone"
        id="userPhone"
        required
        class="input-field"
      />
      <label for="reservationDate">Reservation Date:</label>
      <input
        type="date"
        v-model="reservationDate"
        id="reservationDate"
        required
        class="input-field"
      />
      <label for="startTime">Start Time:</label>
      <input
        type="time"
        v-model="startTime"
        id="startTime"
        required
        class="input-field"
      />
      <label for="endTime">End Time:</label>
      <input
        type="time"
        v-model="endTime"
        id="endTime"
        required
        class="input-field"
      />
      <button
        type="submit"
        class="submit-button"
      >
        Submit Reservation
      </button>
    </form>
    <section
      v-if="reservationResult"
      class="result-section"
    >
      <h3>Reservation Details</h3>
      <p>User ID: {{ reservationResult.user_id }}</p>
      <p>Field ID: {{ reservationResult.field_id }}</p>
      <p>Phone Number: {{ reservationResult.user_phone }}</p>
      <p>Start Time: {{ reservationResult.start_time }}</p>
      <p>End Time: {{ reservationResult.end_time }}</p>
      <p>Total Price: {{ reservationResult.total_price }} VND</p>
    </section>
  </div>
</template>

<script>
import createReservation from '@/services/reservation.services';
import fieldServices from '@/services/fields.services';
import _debounce from 'lodash/debounce'; // Import debounce from lodash

export default {
  data() {
    return {
      fieldId: '', // User enters field ID
      userPhone: '', // User enters phone number
      reservationDate: '', // Reservation date
      startTime: '', // Start time
      endTime: '', // End time
      fieldStatus: '', // Field status based on ID
      reservationResult: null, // Reservation result from server
      fetchFieldStatusDebounced: null // To store the debounced function
    };
  },
  created() {
    // Initialize the debounced function
    this.fetchFieldStatusDebounced = _debounce(this.fetchFieldStatus, 500); // Delay of 500ms
  },
  methods: {
    // Method to fetch field status by field ID
    async fetchFieldStatus() {
      if (this.fieldId.trim() === '') {
        this.fieldStatus = '';
        return;
      }

      try {
        const response = await fieldServices.fetchFieldById(this.fieldId);

        if (response.status === 'success') {
          this.fieldStatus = `Status: ${response.data.status}`; // Display field status
        } else {
          this.fieldStatus = 'Field not found.';
        }
      } catch (error) {
        console.error('Error while fetching field status:', error);
        this.fieldStatus = 'Error fetching status.';
      }
    },

    // Method to trigger debounced fetchFieldStatus when user types
    onFieldIdInput() {
      this.fetchFieldStatusDebounced(); // Calls the debounced function
    },

    // Method to submit reservation
    async submitReservation() {
      const reservationData = {
        field_id: this.fieldId,
        user_phone: this.userPhone,
        reservation_date: this.reservationDate,
        start_time: this.startTime,
        end_time: this.endTime
      };

      try {
        const token = localStorage.getItem('userToken'); // Retrieve token from localStorage
        const response = await createReservation(reservationData, token);

        if (response.status === 'success') {
          this.reservationResult = response.data.reservation; // Display result
        } else {
          alert('Reservation failed. Please try again.');
        }
      } catch (error) {
        console.error('Error while creating reservation:', error);
        alert('An error occurred while sending the request.');
      }
    }
  }
};
</script>

<style scoped>
/* General form styling */
.reservation-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
}

.input-field {
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.submit-button {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

/* Field status styling */
.field-id-container {
  display: flex;
  align-items: center;
}

.field-status {
  margin-left: 10px;
  color: #ff6347;
  font-size: 1rem;
}

/* Result section styling */
.result-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f1f1f1;
  border-radius: 8px;
}

.result-section h3 {
  text-align: center;
  margin-bottom: 15px;
}

.result-section p {
  font-size: 1rem;
  margin-bottom: 8px;
}
</style>
