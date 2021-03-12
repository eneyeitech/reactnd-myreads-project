import React from 'react'

function BookCard(props){
  const {book,onSelectHandler} = props;
  return (
  	
                        <div className="book">
                          <div className="book-top">
                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks && book.imageLinks.smallThumbnail})` }}></div>
                            <div className="book-shelf-changer">
                              <select 
								onChange={(event) => onSelectHandler(event.target.value,book)}
								value={book.shelf ? book.shelf : 'none'}
								>
                                <option value="move" disabled>Move to...</option>
                                <option value="currentlyReading">Currently Reading</option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">{book.title}</div>
                          <div className="book-authors">{book.authors && book.authors.map((author)=>(`${author}`))}</div>
                        </div>
                        
  )
}

export default BookCard