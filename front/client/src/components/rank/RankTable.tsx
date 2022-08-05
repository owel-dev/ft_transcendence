import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { rankRowType, userRank } from 'types/RankTypes';
import { loginState } from 'utils/recoil/login';
import { errorState } from 'utils/recoil/error';
import RankRow from 'components/rank/RankRow';
import instance from 'utils/axios';
import RankTitleRow from './RankTitleRow';

function RankTable() {
  const [rank, setRank] = useState<userRank | null>(null);
  const setIsLoggedIn = useSetRecoilState(loginState);
  const setErrorMessage = useSetRecoilState(errorState);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const getAPI = await instance.get(`/stat`);
      setRank(getAPI.data);
    } catch (e: any) {
      if (e.message === `Network Error`) {
        setErrorMessage('E500');
      } else if (e.response.status === 403) {
        alert('다시 로그인 해주세요!!');
        localStorage.removeItem('trans-token');
        setIsLoggedIn(false);
        window.location.replace('/');
      } else {
        setErrorMessage('RT01');
      }
    }
  };

  return (
    <div className='rank-table'>
      <RankTitleRow />
      {rank?.ranking.map((val: rankRowType, index: number) => {
        const row_type = index % 2 ? 'rank-row' : 'rank-row-gray';
        return <RankRow key={index} rankrow={val} type={row_type} />;
      })}
    </div>
  );
}

export default RankTable;
