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
    query:'',
    errorInSearch: false
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
	componentDidUpdate(prevProps, prevState) {
  	if (prevState.query !== this.state.query) {
  	BooksAPI.search(this.state.query, 4)
      .then((searchedBooks) => {
       if(Array.isArray(searchedBooks)){
        this.setState(() => ({
          searchedBooks,
          errorInSearch: false
        }))
       }else{
        if(this.state.query !== ''){
        this.setState(() => ({
          searchedBooks:[],
          errorInSearch: true
        }))
       }
       }
        console.log('All',this.state.searchedBooks); 
      }).catch((e)=>{
      	console.log('Error',e);
    	this.setState(() => ({
          searchedBooks:[],
          errorInSearch: true
        }))
    })
 	 }
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

  
  if (query.trim() === '') {
      this.setState({
        searchedBooks: [],
        query: '',
        errorInSearch: false
      })
      return
    }
  
    console.log('text',query); 
  	this.setState({
        query: query,
      
      })
  
	
 
}


  render() {
    
    //const r = BooksAPI.getAll();
//	console.log('All',r);   
    const {books, query, searchedBooks, errorInSearch} = this.state;
    const readBooks = books.filter((book)=>(
    book.shelf === 'read'
    ));
const wantToReadBooks = books.filter((book)=>(
    book.shelf === 'wantToRead'
    ))
const currentlyReadingBooks = books.filter((book)=>(
    book.shelf === 'currentlyReading'
    ))
const modifiedSearchedBooks = searchedBooks.map((book)=>{
		let found = books.find((b)=>(
          //console.log(b.id===book.id);
        	b.id === book.id
        ));
  
  		return (found instanceof Object) ? {...book, shelf: found.shelf}:book;
	})
    console.log('modifiedSearchedBooks',modifiedSearchedBooks);
    return (
      <div className="app">
      <Route path='/search' render={({history})=>(
          <div className="search-books">
            <div className="search-books-bar">
             
<Link className="close-search"
                    to='/'>
                    Close
                </Link>
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
			{modifiedSearchedBooks.length > 0 && (
            <div>
              <h3>Search returned {searchedBooks.length} books </h3>
              <ListBooks showingBooks={modifiedSearchedBooks} onSelectHandler={this.selectHandler}/></div>
   )}
{errorInSearch && (
            <h3>Search did not return any books. Please try again!</h3>
          )}
            </div>
          </div>
)} />
        <Route exact path='/' render={() => (
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
      				<Link
                    to='/search'>
                    Add a book
                </Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp