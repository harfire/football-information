import React, { useState, useEffect } from 'react';
import getAPI from '../utils/getAPI';
import LoadingUi from './common/Loading';
import leagueList from '../constants/leagueList';

export default function Content(props) {
  const [initLoading, setInitLoading] = useState(true);
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [scorersLoading, setScorersLoading] = useState(true);
  const [itemNotFound, setItemNotFound] = useState(false);
  const [leagueStandingList, setLeagueStandingList] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('seriea');

  async function getDataLeague(method, endpoint, params) {
    try {
      const { data } = await getAPI(method, endpoint, params);

      if (data) {
        setLeagueStandingList(buildData(data));
      }
    } catch (error) {
      // TODO: Create proper function to error handling
    } finally {
      setInitLoading(false);
      setTimeout(() => setIsLoadingOverlay(false), 100);
    }
  }

  async function getDataScorers(method, endpoint, params) {
    try {
      const { data } = await getAPI(method, endpoint, params);

      if (data) {
        setScorers(buildData(data));
      }
    } catch (error) {
      // TODO: Create proper function to error handling
    } finally {
      setScorersLoading(false);
      setTimeout(() => setIsLoadingOverlay(false), 100);
    }
  }

  const buildData = (data) => {
    return data.map((val) => ({
      ...val,
      selected: false,
    }));
  };

  useEffect(() => {
    getDataLeague('GET', `${process.env.REACT_APP_BASE_API}seriea/squads`, {});
    getDataScorers('GET', `${process.env.REACT_APP_BASE_API}seriea/scorers`, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchKeyword) {
      setLeagueStandingList(clearSelection(leagueStandingList));
      setScorers(clearSelection(scorers));
      setItemNotFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword]);

  const clearSelection = (arr) =>
    arr.map((val) => ({
      ...val,
      selected: false,
    }));

  const championshipStatus = (league, index) => {
    const position = index + 1;
    const findLeague = leagueList.find((val) => val.id === league);

    if (tabIndex === 0 && findLeague.qualification.champion.includes(index + 1)) return 'blue';
    if (tabIndex === 0 && findLeague.qualification.champion_qualification.includes(index + 1)) return 'lightblue';
    if (tabIndex === 0 && findLeague.qualification.europa.includes(index + 1)) return 'yellow';
    if (tabIndex === 0 && findLeague.qualification.europa_qualification.includes(index + 1)) return 'purple';
    if (tabIndex === 0 && findLeague.qualification.relegation.includes(index + 1)) return 'red';

    return '';
  };

  const changeLeague = (e) => {
    const { value } = e.target;
    setSelectedLeague(value);
    setIsLoadingOverlay(true);
    getDataLeague('GET', `${process.env.REACT_APP_BASE_API}${value}/squads`, {});
    getDataScorers('GET', `${process.env.REACT_APP_BASE_API}${value}/scorers`, {});
  };

  const searchByKeyword = (e) => {
    e.preventDefault();

    const dataLeague = clearSelection(leagueStandingList);
    const dataScorers = clearSelection(scorers);
    const keyword = searchKeyword.toLowerCase();

    if (keyword) {
      setItemNotFound(false);

      if (tabIndex === 0) {
        const dataFiltered = dataLeague.map((val) => (val.squad_name.toLowerCase().includes(keyword) ? { ...val, selected: true } : val));
        setLeagueStandingList(dataFiltered);

        if (!dataFiltered.some((val) => val.selected)) setItemNotFound(true);
      } else {
        const dataFiltered = dataScorers.map((val) => (val.player_name.toLowerCase().includes(keyword) ? { ...val, selected: true } : val));
        setScorers(dataFiltered);

        if (!dataFiltered.some((val) => val.selected)) setItemNotFound(true);
      }
    }
  };

  return (
    <div className='columns is-multiline is-gapless' id='main-container'>
      {isLoadingOverlay && (
        <div className='overlay-loading'>
          <div className='is-clearfix has-text-centered'>
            <LoadingUi></LoadingUi>
          </div>
        </div>
      )}

      <div className='column is-full'>
        <div className='columns m-b-0'>
          <div className='column is-half'>
            <div className='field'>
              <div className='control'>
                <div className='select is-warning is-fullwidth'>
                  <select onChange={(e) => changeLeague(e)} disabled={initLoading}>
                    {leagueList.map((val, i) => (
                      <option key={`leagueList-${i}`} value={val.id}>
                        {val.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className='column is-half'>
            <form onSubmit={(e) => searchByKeyword(e)}>
              <div className='field has-addons'>
                <div className='control is-expanded'>
                  <input onChange={(e) => setSearchKeyword(e.target.value)} className={'input is-warning is-fullwidth'} type='text' placeholder='Search' disabled={initLoading} />
                </div>
                <div className='control'>
                  <button type='submit' className='button is-warning' disabled={initLoading}>
                    Cari
                  </button>
                </div>
              </div>
            </form>
            {itemNotFound && <div className='is-danger'>Data tidak ditemukan!</div>}
          </div>
        </div>
        {initLoading || scorersLoading ? (
          <div className='is-clearfix has-text-centered'>
            <LoadingUi></LoadingUi>
          </div>
        ) : (
          <div className='is-clearfix'>
            <div className='tabs is-centered'>
              <ul>
                <li onClick={() => setTabIndex(0)} className={tabIndex === 0 ? 'is-active' : ''}>
                  <a href='!#'>
                    <span>Klasemen</span>
                  </a>
                </li>
                <li onClick={() => setTabIndex(1)} className={tabIndex === 1 ? 'is-active scorers' : ''}>
                  <a href='!#'>
                    <span>Top Skor</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className={tabIndex === 0 ? 'columns is-gapless logo-club-cont m-0 p-0' : 'columns is-gapless logo-club-cont tab-scorers m-0 p-0'}>
              {leagueList.map((val, i) => (
                <div key={`leagueList-${i}`} className={selectedLeague === val.id ? 'column has-text-centered is-one-fifth' : 'column has-text-centered is-one-fifth greyscale'}>
                  <img className='p-t-10' src={val.logo} alt={val.name} />
                </div>
              ))}
            </div>

            {tabIndex === 0 && (
              <>
                <table className='table is-striped is-fullwidth'>
                  <thead>
                    <tr>
                      <th className='has-text-centered'>#</th>
                      <th>Tim</th>
                      <th className='has-text-centered'>Main</th>
                      <th className='has-text-centered'>Total Poin</th>
                      <th className='has-text-centered'>Menang</th>
                      <th className='has-text-centered'>Imbang</th>
                      <th className='has-text-centered'>Kalah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueStandingList.map((val, i) => (
                      <tr key={`leagueStandingList-${i}`} className={val.selected ? 'selected-row' : ''}>
                        <td className={`champion-${championshipStatus(selectedLeague, i)} has-text-centered`}>{i + 1}</td>
                        <td className='has-text-weight-semibold'>{val.squad_name}</td>
                        <td className='has-text-centered'>{val.squad_played}</td>
                        <td className='has-text-centered has-text-weight-semibold'>{val.squad_points}</td>
                        <td className='has-text-centered'>{val.squad_winned}</td>
                        <td className='has-text-centered'>{val.squad_tie}</td>
                        <td className='has-text-centered'>{val.squad_loosed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='collumns is-gapless is-multiline color-desc-cont'>
                  <div className='column is-full p-0'>
                    <span className='champion-blue color-icon'></span>
                    <span className='color-desc-name'>Liga Champion</span>
                    <span className='champion-lightblue color-icon'></span>
                    <span className='color-desc-name'>Kualifikasi Liga Champion</span>
                    <span className='champion-yellow color-icon'></span>
                    <span className='color-desc-name'>Liga Eropa</span>
                    <span className='champion-purple color-icon'></span>
                    <span className='color-desc-name'>Kualifikasi Liga Eropa</span>
                    <span className='champion-red color-icon'></span>
                    <span className='color-desc-name'>Degradasi</span>
                  </div>
                </div>
              </>
            )}

            {tabIndex === 1 && (
              <table className='table is-striped is-fullwidth'>
                <thead className='th-scorers'>
                  <tr>
                    <th className='has-text-centered'>#</th>
                    <th>Nama</th>
                    <th className='has-text-centered'>Klub</th>
                    <th className='has-text-centered'>Posisi</th>
                    <th className='has-text-centered'>Penalti</th>
                    <th className='has-text-centered'>Total Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {scorers.map((val, i) => (
                    <tr key={`leagueStandingList-${i}`} className={val.selected ? 'selected-row' : ''}>
                      <td className='has-text-centered'>{i + 1}</td>
                      <td className='has-text-weight-semibold'>
                        <span className='icon m-r-5'>
                          <i className='fas fa-futbol'></i>
                        </span>
                        <span>{val.player_name}</span>
                      </td>
                      <td className='has-text-centered'>{val.player_squad}</td>
                      <td className='has-text-centered'>{val.player_role}</td>
                      <td className='has-text-centered'>{val.player_penalties}</td>
                      <td className='has-text-centered has-text-weight-semibold'>{val.player_goals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
