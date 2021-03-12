import React from 'react'
import BookCard from './BookCard'

function ListBooks(props){
  const {showingBooks, onSelectHandler} = props;
  //console.log('Showing Books',showingBooks);
  return (
     
                    <ol className="books-grid">
                      {showingBooks.map((book) => (
              			<li key={book.id} >
                			<BookCard book={book} onSelectHandler={onSelectHandler}/>
              			</li>
     				  ))}            
                    </ol>                       
  )
}

export default ListBooks