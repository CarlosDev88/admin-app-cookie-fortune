import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import UsersTable from './UsersTable'

import './styles.global.css'

const AdminCookiesFortune: FC = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-cookies.title-table" />}
        />
      }
    >
      <PageBlock variation="full">
        <UsersTable />
      </PageBlock>
    </Layout>
  )
}

export default AdminCookiesFortune
