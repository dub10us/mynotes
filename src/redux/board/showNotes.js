import calculateNotesMaxZ from './calculateNotesMaxZ';
import noteInitialState from './note/noteInitialState';
import calculateNotesViewDimensions from './calculateNotesViewDimensions';

/**
 * Initialize an array of notes according to data from the server
 * @param  {Array} notesServerData an array of notes data
 * @return {Array}                 result notes array
 */
function initializeNotes(notesServerData) {
  const notes = [];

  notesServerData.forEach((noteServerData) => {
    const note = Object.assign({}, noteInitialState(), noteServerData);
    notes.push(note);
  });

  return notes;
}

/**
 * Add notes to the board state from board data object and returns new state
 * More specifically apply state which server is not aware of
 * like notes dimensions in pixels
 * @param  {Object} state old state
 * @param  {Object} board board data
 * @return {Object}       new state
 */
function showNotes(state, board) {
  const newNotes = calculateNotesViewDimensions(
    initializeNotes(board.notes),
    state.viewDimensions,
  );
  return Object.assign({}, state, {
    id: board.id,
    notesMaxZ: calculateNotesMaxZ(newNotes),
    notes: newNotes,
    getInProgres: false,
    errorMessage: null,
  });
}

export default showNotes;
