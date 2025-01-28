import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

interface Donation {
  id: string;
  amount: number;
  description: string;
  user: {
    id: number;
    name: string;
  };
}
interface DonationForm {
  amount: number;
  description: string;
  user: {
    id: number;
    name: string;
  };
}

interface DonationSummary {
  totalAmount: number;
  totalCount: number;
  activeAmount: number;
  activeCount: number;
  deletedAmount: number;
  deletedCount: number;
}

interface MonthlySummary {
  month: number; // 1-12 representing months
  year: number; // e.g., 2024
  monthName: string; //e.g.,January
  totalAmount: number; // total donations for the month
  count: number; // number of donations for the month
}

interface DonationState {
  donations: Donation[];
  donationDetails: Donation | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  donationSummary: DonationSummary | null;
  monthlySummary: MonthlySummary[];
}

const initialState: DonationState = {
  donations: [],
  donationDetails: null,
  loading: false,
  error: null,
  totalPages: 1,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
  },
  donationSummary: null,
  monthlySummary: [],
};

// Create Donation
export const createDonation = createAsyncThunk(
  "donation/createDonation",
  async (donationData: DonationForm, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/donations", donationData);
      console.log("Donation " + response);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Fetch Donation Details
export const fetchDonationDetails = createAsyncThunk(
  "donation/fetchDonationDetails",
  async (id: string, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/donations/${id}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// List Donation
export const listDonations = createAsyncThunk(
  "donation/listDonations",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/donations`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Edit Donation
export const editDonation = createAsyncThunk(
  "donation/editDonation",
  async (
    { id, donationData }: { id: string; donationData: DonationForm },
    thunkAPI,
  ) => {
    try {
      const response = await axiosInstance.put(
        `/donations/${id}`,
        donationData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

// Delete Donation
export const deleteDonation = createAsyncThunk(
  "donation/deleteDonation",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/donations/${id}`);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

export const fetchDonationSummary = createAsyncThunk(
  "donation/fetchDonationSummary",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/donations/summary/report");
      console.log("donation summary" + response.data);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

export const fetchMonthlySummary = createAsyncThunk(
  "donation/fetchMonthlySummary",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/donations/summary/monthly");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createDonation.fulfilled,
        (state, action: PayloadAction<Donation>) => {
          state.loading = false;
          state.donations.push(action.payload);
        },
      )
      .addCase(createDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDonationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDonationDetails.fulfilled,
        (state, action: PayloadAction<Donation>) => {
          state.loading = false;
          state.donationDetails = action.payload;
        },
      )
      .addCase(fetchDonationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(listDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(listDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.donations = action.payload;
      })
      .addCase(listDonations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        editDonation.fulfilled,
        (state, action: PayloadAction<Donation>) => {
          state.loading = false;
          const index = state.donations.findIndex(
            (donation) => donation.id === action.payload.id,
          );
          if (index !== -1) {
            state.donations[index] = action.payload;
          }
        },
      )
      .addCase(editDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDonation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteDonation.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.donations = state.donations.filter(
            (donation) => donation.id !== action.payload,
          );
        },
      )
      .addCase(deleteDonation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDonationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDonationSummary.fulfilled,
        (state, action: PayloadAction<DonationSummary>) => {
          state.loading = false;
          state.donationSummary = action.payload;
        },
      )
      .addCase(fetchDonationSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //monthly summary
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMonthlySummary.fulfilled,
        (state, action: PayloadAction<MonthlySummary[]>) => {
          state.loading = false;
          state.monthlySummary = action.payload;
        },
      )
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default donationSlice.reducer;
