import { useEffect, useMemo, useState } from 'react'
import { listJson } from './data'

const navArr = ['Clicker', 'Shooting', 'puzzle', 'Soccer', 'Action', 'Sports', 'Stickman']

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [value, setValue] = useState('')

  const submitSearch = (searchValue = value) => {
    if (searchValue) {
      setSearchOpen(false)
      setMenuOpen(false)
      setValue('')
      document.documentElement.style.overflowY = 'auto'
      navigate(`/search.html?value=${encodeURIComponent(searchValue)}`)
    }
  }

  const toggleMenu = () => {
    setMenuOpen((open) => !open)
    setSearchOpen(false)
    document.documentElement.style.overflowY = menuOpen ? 'auto' : 'hidden'
  }

  const toggleSearch = () => {
    const nextOpen = !searchOpen
    setSearchOpen(nextOpen)
    if (!nextOpen) setValue('')
    setMenuOpen(false)
    document.documentElement.style.overflowY = searchOpen ? 'auto' : 'hidden'
  }

  useEffect(() => {
    const closeOverlays = () => {
      setSearchOpen(false)
      setMenuOpen(false)
      setValue('')
      document.documentElement.style.overflowY = 'auto'
    }

    window.addEventListener('popstate', closeOverlays)
    return () => {
      window.removeEventListener('popstate', closeOverlays)
      document.documentElement.style.overflowY = 'auto'
    }
  }, [])

  return (
    <header>
      <div className="header">
        <div className="left" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="playwizzy" />
        </div>
        <nav className={`center ${menuOpen ? 'mobile-open' : ''}`}>
          {navArr.map((item) => (
            <div className="centerLi" key={item} onClick={() => {
              navigate(`/classify.html?type=${encodeURIComponent(item)}`)
              setMenuOpen(false)
              document.documentElement.style.overflowY = 'auto'
            }}>{item}</div>
          ))}
        </nav>
        <form className={`searchBox ${searchOpen ? 'mobile-search-open' : ''}`} onSubmit={(event) => {
          event.preventDefault()
          submitSearch(event.currentTarget.elements.search.value)
        }}>
          <input
            name="search"
            type="text"
            placeholder="Search Game"
            autoComplete="off"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                submitSearch(event.currentTarget.value)
              }
            }}
          />
          <p className="searchBtn" onClick={() => submitSearch()}><img src="/images/search.png" alt="Search" /></p>
        </form>
        <div className="right">
          <div className="menu" onClick={toggleMenu}>
            <img src={`/images/${menuOpen ? 'close' : 'menu'}.png`} alt="Menu" />
          </div>
          <div className="search" onClick={toggleSearch}>
            <img src={`/images/${searchOpen ? 'close' : 'search'}.png`} alt="Search" />
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return <footer style={{ marginBottom: 60 }}><div className="footerBox">
    <a href="Privacy.html">Privacy Policy</a>
    <a href="Terms.html">Terms of Service</a>
    <div>©2026 playwizzy.site All Rights Reserved</div>
  </div></footer>
}

function AdArea() {
  return <div className="de_iv_adv"><div style={{ textAlign: 'center', color: 'gray', fontSize: 13, lineHeight: 1.5 }}>advertisement</div></div>
}

function GameCard({ game, featured = false }) {
  return <a title={game.title} className={`span2 ${featured ? 'gr-s22' : 'gr-s11'}`} onClick={() => navigate(`/game.html?id=${game.id}`)}>
    <img src={game.thumb} alt={game.title} />
    <span className="game-title">{game.title}</span>
  </a>
}

function GameGrid({ games, home = false }) {
  return <div className={home ? 'grd grd1' : 'grd'}>
    {games.map((game, index) => <GameCard key={game.id} game={game} featured={home && index < 20 && index % 5 === 0} />)}
  </div>
}

function Home() {
  const featured = listJson.slice(0, window.innerWidth > 960 ? 68 : 66)
  const latest = listJson.slice(featured.length, featured.length + 20)
  return <>
    <AdArea />
    <div className="postionFixed" />
    <div className="bannerImg"><div className="bannertext">
      <img src="/images/bannerImg.png" alt="" />
      <p>Welcome to playwizzy.site</p>
      <p>Start a random game</p>
      <div className="bannerButton" onClick={() => {
        const game = listJson[Math.floor(Math.random() * listJson.length)]
        navigate(`/game.html?id=${game.id}`)
      }}>Random Game</div>
    </div></div>
    <main><GameGrid games={featured} home /><div className="masonry masonry-list">
      {latest.map((game) => <div className="listLi" key={game.id} onClick={() => navigate(`/game.html?id=${game.id}`)}><img src={game.thumb} alt={game.title} /><p>{game.title}</p></div>)}
    </div></main>
    <Footer />
  </>
}

function Listing({ search = false }) {
  const params = new URLSearchParams(window.location.search)
  const value = search ? params.get('value') || '' : params.get('type') || ''
  const games = useMemo(() => search
    ? listJson.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
    : listJson.filter((item) => item.category.toLowerCase() === value.toLowerCase()), [search, value])

  return <>
    <AdArea />
    <main className="listing-page">
      {search ? <div className="classTitle"><i>Search "{value}" games {games.length}</i></div> : <div className="listTitle"><p>{value} Games</p></div>}
      {search && games.length === 0 ? <div className="grd"><img src="/images/searchBg.png" alt="No games found" className="searchBg" /></div> : <GameGrid games={games} />}
      {!search && <div className="loading" />}
    </main>
    <div className="postionFixed" />
    <Footer />
  </>
}

function GamePage() {
  const id = new URLSearchParams(window.location.search).get('id')
  const game = listJson.find((item) => item.id === id) || listJson[0]
  const recommendations = listJson.filter((item) => item.id !== game.id).sort(() => Math.random() - 0.5).slice(0, window.innerWidth > 960 ? 24 : 9)
  return <>
    <AdArea />
    <div className="postionFixed" />
    <main className="game-page"><div className="mainbox" id="play">
      <div className="gameCon"><div className="gamePlay" style={{ backgroundImage: `url(${game.thumb})` }} />
        <div className="gamedet"><div className="gamedetLeft"><div className="baifenbaiBox"><div className="gameimgBox"><img src={game.thumb} alt={game.title} /></div></div><div className="buttonBox"><button id="sdk__splash-button" onClick={() => navigate(`/gamedet.html?url=${encodeURIComponent(game.url)}`)}>Play Game</button></div></div></div>
      </div>
      <div className="gameDet"><div className="gameDetBottom"><b>{game.title}</b><br />{game.description}</div></div>
      <div className="gameLiBox"><GameGrid games={recommendations} /></div>
    </div></main>
    <Footer />
  </>
}

function GameDetail() {
  const url = new URLSearchParams(window.location.search).get('url')
  return <div className="iframe-page"><div className="mobile-logo" onClick={() => window.history.back()}><img src="/images/back.png" alt="Back" /></div><div className="ifamerCon"><iframe src={url || listJson[0].url} title="Game" frameBorder="0" /></div></div>
}

function App() {
  const [, refresh] = useState(0)
  useEffect(() => {
    const onPopState = () => refresh((value) => value + 1)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const path = window.location.pathname.toLowerCase()
  if (path.endsWith('gamedet.html')) return <GameDetail />
  return <><Header />{path.endsWith('game.html') ? <GamePage /> : path.endsWith('classify.html') ? <Listing /> : path.endsWith('search.html') ? <Listing search /> : <Home />}</>
}

export default App
