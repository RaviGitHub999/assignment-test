import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
export interface User {
  id: number;
  name: string;
}
interface Posts {
  userId: number;
  title: string,
  body: string,
  id: number;
}
interface Albums {
  userId: number,
  id: number,
  title: string
}
interface CounterState {
  users: User[];
  loading: boolean
  // loading1: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
  post: Posts[],
  comment: string,
  updateStatus: boolean,
  index: number,
  albums: Albums[],
}

const initialState: CounterState = {
  users: [],
  loading: false,
  error: null,
  post: [],
  comment: "",
  updateStatus: false,
  index: 0,
  albums: [],
};

export const fetchingUserData = createAsyncThunk('userData/fetch', async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data: User[] = await response.json();
    const addkey = data.map((ele, ind) => {
      return (
        { ...ele, userId: ind + 1 }
      )
    })

    return addkey;
  } catch (error) {
    throw error;
  }
});

export const fetchPost = createAsyncThunk("userPosts/fetch", async (userId: number) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const postdata: Posts[] = await response.json();
    const filterData = postdata.filter((ele) => ele.userId === userId)
    return filterData;
  } catch (error) {
    throw error;
  }
})

export const upDatePost = createAsyncThunk("getAlbums", async (userId: number) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/albums');
    const albums: Albums[] = await response.json();
    const filterData = albums.filter((ele) => ele.userId === userId)
    return filterData;
  } catch (error) {
    throw error;
  }
})
const counterSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    handleDelete: (state, action) => {
      state.post = state.post.filter((ele) => ele.id !== action.payload)
    },
    handleonChange: (state, action) => {
      state.comment = action.payload
    },
    handleUpdate: (state, action) => {
      const upDate = state.post.filter((ele) => ele.id === action.payload)
      state.comment = upDate[0].body
      state.updateStatus = true
      state.index = action.payload

    },
    handleUpdateComment: (state, action) => {
      const editedCommit = state.post.map((ele) => {
        if (ele.id === state.index) {
          return {
            ...ele,
            body: state.comment
          }
        }
        else {
          return ele
        }
      })
      state.post = editedCommit
      state.comment = ""
      state.updateStatus = false
    },
    handleAdd: (state, action) => {
      const newObj = {
        id: new Date().getSeconds(),
        userId: action.payload,
        title: "new Post",
        body: state.comment
      }
      state.post = [...state.post, newObj]
      state.comment = ""
    
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchingUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchingUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchingUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'An error occurred';
      });
    // posts
    builder
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'An error occurred';
      });
    //albums
    builder
      .addCase(upDatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(upDatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(upDatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'An error occurred';
      });
  },
});


export const { handleDelete, handleonChange, handleUpdate, handleUpdateComment, handleAdd } = counterSlice.actions
export default counterSlice.reducer;
