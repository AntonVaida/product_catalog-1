import React, { useEffect, useState } from 'react';
import { getProductsByQuery } from '../../api/products';
import { ItemsQuantity } from '../../components/ItemsQuantity';
import { PhoneList } from '../../components/PhonesList/PhoneList';
import { Pagination } from '../../components/UI/Pagination';
import { CustomSelect } from '../../components/UI/Select';
import { Phone } from '../../types/Phone';
import { scrollToTop } from '../../utils/scrollToTop';

import './PhonesPage.scss';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetically', label: 'Alphabetically' },
  { value: 'cheapest', label: 'Cheapest' },
  { value: 'expensive', label: 'Expensive' },
];

const perPageOptions = [
  { value: 'all', label: 'All' },
  { value: '4', label: '4' },
  { value: '8', label: '8' },
  { value: '16', label: '16' },
];

export const PhonesPage = () => {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [phonesLength, setPhonesLength] = useState(0);
  const [sortType, setSortType] = useState('newest');
  const [perPage, setPerPage] = useState('all');
  const [page, setPage] = useState(1);

  const handleOnSortSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
  };

  const handleOnPerPageSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPerPage(event.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    scrollToTop();
  };

  const getPhones = async () => {
    const query = `?sort=${sortType}&page=${page}&perPage=${perPage}`;
    const products = await getProductsByQuery(query);

    setPhones(products.phones);
    setPhonesLength(products.length);
  };

  useEffect(() => {
    getPhones();
  }, [sortType, perPage, page]);

  return (
    <section className="phones-page">
      <div className="container">
        <div className="phones-page__breadcrumbs text text--secondary">
          Home - Phones
        </div>
        {/* Breadcrumbs path={[{title:Home, path: 'link:path'}]} */}
        <h1 className="phones-page__title title title--xl text-reset">
          Mobile phones
        </h1>

        <div className="phones-page__quantity">
          <ItemsQuantity amount={71} itemName="models" />
        </div>

        <div className="phones-page__selects">
          <CustomSelect
            selectLabel="Sort by"
            defaultValue="Choose sorting type"
            options={sortOptions}
            selected={sortType}
            handleOnSelect={handleOnSortSelect}
          />
          <CustomSelect
            selectLabel="Items on page"
            defaultValue="Choose items amount"
            options={perPageOptions}
            selected={perPage}
            handleOnSelect={handleOnPerPageSelect}
          />
        </div>

        <div className="phones-page__list">
          <PhoneList phones={phones} />
        </div>

        {!Number.isNaN(+perPage) && (
          <Pagination
            total={phonesLength}
            perPage={+perPage}
            onPageChange={handlePageChange}
            currentPage={page}
          />
        )}
      </div>
    </section>
  );
};
