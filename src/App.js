import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'


class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books:[],
    searchedBooks: [],
    query:''
  }

  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          books
        }))
        console.log('All',this.state.books); 
      })
	
  }

selectHandler = (value,book) => {
	//console.log('Select Value',value);
  	//console.log('Book',book.title);
  	const elementsIndex = this.state.books.findIndex(b => b.id === book.id );
  	
  	console.log(elementsIndex);
  if(elementsIndex===-1){
    const newBook = {...book, shelf: value}
    this.setState((prevState) => ({
        books: prevState.books.concat([newBook])
    }));
  }else{
    let newArray = [...this.state.books];
  	newArray[elementsIndex] = {...newArray[elementsIndex], shelf: value};
  
  	this.setState(() => ({
        books: newArray
    }));
  }
  	//console.log('New Array', newArray);
  	
  	this.updateBook(book, value);
}

updateBook = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then((b)=>{
      console.log(b + ' updated')
    })
  }

searchBooks = (query) => {
  console.log('text',query); 
  	this.setState({
        query: query.trim()
      })
  console.log('state',this.state.query); 
  if(this.state.query !== ''){
	BooksAPI.search(this.state.query, 4)
      .then((searchedBooks) => {
       if(Array.isArray(searchedBooks)){
        this.setState(() => ({
          searchedBooks
        }))
       }
        console.log('All',this.state.searchedBooks); 
      })
  }else{
    this.setState(()=>({
    	searchedBooks:[]
    }))
  }
}


  render() {
    
    //const r = BooksAPI.getAll();
//	console.log('All',r);   
    const {books, query, searchedBooks} = this.state;
    const readBooks = books.filter((book)=>(
    book.shelf === 'read'
    ));
const wantToReadBooks = books.filter((book)=>(
    book.shelf === 'wantToRead'
    ))
const currentlyReadingBooks = books.filter((book)=>(
    book.shelf === 'currentlyReading'
    ))
    
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"
					value={query}
              		onChange={(event) => this.searchBooks(event.target.value)}
				/>

              </div>
            </div>
            <div className="search-books-results">
              <ListBooks showingBooks={searchedBooks} onSelectHandler={this.selectHandler}/>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ListBooks showingBooks={currentlyReadingBooks} onSelectHandler={this.selectHandler}/>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks showingBooks={wantToReadBooks} onSelectHandler={this.selectHandler}/>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks showingBooks={readBooks} onSelectHandler={this.selectHandler}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
