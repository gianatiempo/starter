import { useState } from 'react'
import { PageHeader } from '@ant-design/pro-layout'
import { Space, Button, Form, Card, Statistic, Divider, InputNumber } from 'antd'
import PageContentWrapper from '@components/PageContentWrapper'
import { useDocumentTitle } from '@hooks'
import { ars, bill } from '@utils'

const BillingPage = () => {
  useDocumentTitle('Billing')
  const [values, setValues] = useState({ lower: 20000, higher: 40000, amount: 250000 })

  return (
    <>
      <PageHeader title='Billing' subTitle='All your bills randomized for you to choose!' />
      <PageContentWrapper>
        <Space direction='horizontal' size='middle' align='start'>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={values}
            onFinish={values => setValues(values)}
            autoComplete='off'>
            <Form.Item
              label='Lower Value'
              name='lower'
              rules={[{ required: true, message: 'Please input your lower bill value!' }]}>
              <InputNumber />
            </Form.Item>

            <Form.Item
              label='Higher Value'
              name='higher'
              rules={[{ required: true, message: 'Please input your higher bill value!' }]}>
              <InputNumber />
            </Form.Item>

            <Form.Item
              label='Total Value'
              name='amount'
              rules={[{ required: true, message: 'Please input your total bill value!' }]}>
              <InputNumber />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' htmlType='submit'>
                Calculate
              </Button>
            </Form.Item>
          </Form>
          <Card style={{ width: 300 }}>
            <Statistic title='Total amount to bill' value={ars(values.amount)} />
            <Divider />
            {bill(+values.lower, +values.higher, +values.amount).map((bill, i) => (
              <>
                <Statistic
                  key={bill}
                  prefix={`#${i + 1}:`}
                  value={ars(bill)}
                  valueStyle={{ color: bill > (+values.lower + values.higher) / 2 ? '#3f8600' : '#cf1322' }}
                />
              </>
            ))}
          </Card>
        </Space>
      </PageContentWrapper>
    </>
  )
}

export default BillingPage
