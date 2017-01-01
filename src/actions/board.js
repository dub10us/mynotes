import { push } from 'react-router-redux';
import server from './../server/server';
import serverSaveNotesChanges from './../server/serverSaveNotesChanges';
import { addSelfDisappearingMessage } from './messages';
import { setTitle, sidemenuClose } from './app';
import { editNoteDone } from './noteEditor';

export const getBoardRequest = () => ({
  type: 'GET_BOARD_REQUEST',
});

export const getBoardSuccess = board => ({
  type: 'GET_BOARD_SUCCESS',
  board,
});

export const getBoardError = errorMessage => ({
  type: 'GET_BOARD_ERROR',
  errorMessage,
});

export const getBoard = boardId => (
  (dispatch, getState) => {
    let board = null;
    server.getBoard(boardId)
      .then((response) => {
        board = response;
        return server.getBoardNotes(boardId);
      })
      .then((response) => {
        dispatch(setTitle(response.name));
        dispatch(sidemenuClose());
        dispatch(editNoteDone());
        dispatch(getBoardSuccess({
          ...board,
          notes: response,
        }));
      })
      .catch((err) => {
        if (err === 'Unauthorized') {
          dispatch(getBoardError(err));
          dispatch(push('/login'));
        } else {
          throw err;
        }
      })
      .catch((err) => {
        dispatch(addSelfDisappearingMessage(err.message, 'error'));
        dispatch(getBoardError(err.message));
      });
  }
);

export const saveNotesChangesRequest = () => ({
  type: 'SAVE_NOTES_CHANGES_REQUEST',
});

export const saveNotesChangesSuccess = () => ({
  type: 'SAVE_NOTES_CHANGES_SUCCESS',
});

export const saveNotesChangesError = errorMessage => ({
  type: 'SAVE_NOTES_CHANGES_ERROR',
  errorMessage,
});

export const saveNotesChanges = () => (
  (dispatch, getState) => {
    const changes = getState().board.pendingNotesChanges;
    serverSaveNotesChanges(changes)
      .then((response) => {
        dispatch(saveNotesChangesSuccess());
      })
      .catch((err) => {
        if (err === 'Unauthorized') {
          dispatch(getBoardError(err));
          dispatch(push('/login'));
        } else {
          throw err;
        }
      })
      .catch((err) => {
        dispatch(addSelfDisappearingMessage(err.message, 'error'));
        dispatch(saveNotesChangesError(err.message));
      });
  }
);

export const boardResized = (width, height, top, left) => ({
  type: 'BOARD_RESIZED',
  width,
  height,
  top,
  left,
});

export const noteMakeDraggable = noteId => ({
  type: 'NOTE_MAKE_DRAGGABLE',
  noteId,
});

export const noteMakeNotDraggable = noteId => ({
  type: 'NOTE_MAKE_NOT_DRAGGABLE',
  noteId,
});

export const addPendingNoteChange = (changeType, noteId, data) => ({
  type: 'ADD_PENDING_NOTE_CHANGE',
  changeType,
  noteId,
  data,
});

export const noteMoveStarted = noteId => ({
  type: 'NOTE_MOVE_STARTED',
  noteId,
});

export const noteMoveFinished = (noteId, x, y) => ({
  type: 'NOTE_MOVE_FINISHED',
  noteId,
  x,
  y,
});

export const noteMoveAndSave = (noteId, x, y) => (
  (dispatch, getState) => {
    dispatch(noteMoveFinished(noteId, x, y));
    const note = getState().board.notes[noteId];
    dispatch(addPendingNoteChange('UPDATE', note.id, {
      x: note.x,
      y: note.y,
    }));
    dispatch(saveNotesChanges());
  }
);

export const noteChangeColor = (noteId, color) => ({
  type: 'NOTE_CHANGE_COLOR',
  noteId,
  color,
});

export const noteChangeColorAndSave = (noteId, color) => (
  (dispatch, getState) => {
    dispatch(noteChangeColor(noteId, color));
    const note = getState().board.notes[noteId];
    dispatch(addPendingNoteChange('UPDATE', note.id, {
      color,
    }));
    dispatch(saveNotesChanges());
  }
);

export const noteChangeContent = (noteId, editorState) => ({
  type: 'NOTE_CHANGE_CONTENT',
  noteId,
  editorState,
});

export const noteChangeContentAndSave = (noteId, color) => (
  (dispatch, getState) => {
    dispatch(noteChangeContent(noteId, color));
    const note = getState().board.notes[noteId];
    dispatch(addPendingNoteChange('UPDATE', note.id, {
      content: note.content,
    }));
    dispatch(saveNotesChanges());
  }
);
