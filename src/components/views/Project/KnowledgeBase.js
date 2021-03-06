import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { List, Empty, Modal, Button, Avatar, Input, Icon, Tag } from 'antd'
import { Link } from 'react-router-dom'

import AddAnswerDrawer from './KnowledgeBase/AddAnswerDrawer'
import EditAnswerDrawer from './KnowledgeBase/EditAnswerDrawer'
import { setTitle } from '../../../helpers'

const source = axios.CancelToken.source()

class AnswerItem extends React.Component {
  confirmDelete = (answerId) => {
    Modal.confirm({
      title: 'Удалить ответ',
      content: 'Вы действительно хотите удалить данный ответ? Данные будет безвозвратно утерены.',
      okText: 'Да',
      okType: 'danger',
      cancelText: 'Нет',
      onOk: () => {
        // axios.delete(config.serverUrl + '/app-api/projects/' + this.props.projectId + '/answers/' + answerId + '/')
        this.props.list.deleteOne(answerId)
      }
    })
  }

  render () {
    return (
      <List.Item actions={[
        <Button onClick={() => this.props.openEditModal(this.props.answer.id)}>Открыть</Button>,
        <Button onClick={() => this.confirmDelete(this.props.answer.id)} type='dashed' icon='delete' shape='circle' size='small' />
      ]}
      >
        <List.Item.Meta
          title={<b>{this.props.answer.title}</b>}
          description={
            <div>
              {this.props.answer.content}
              <div className='app-list-item-info'>
                {
                  this.props.answer.tags ? (
                    <div className='app-list-item-info-tags'>
                      {
                        this.props.answer.tags.map((tag) => <Tag className='app-list-item-info-tag'>{tag}</Tag>)
                      }
                    </div>
                  ) : null
                }
              </div>
            </div>
          }
        />
      </List.Item>
    )
  }
}

class KnowledgeBase extends React.Component {
  state = {
    addModalVisible: false,
    editModalVisible: false,
    answerTotalCount: 0,
    answers: null,
    search: '',
    page: 1
  }

  list = {
    addOne: (answer) => {
      const answers = this.state.answers
      const answerTotalCount = this.state.answerTotalCount + 1
      answers.unshift(answer)
      this.setState({ answers, answerTotalCount })
    },
    updateOne: (id, answer) => {
      const answers = this.state.answers
      const answerIndex = answers.findIndex((c) => {
        return c.id == id
      })
      if (answerIndex < 0) return
      answers[answerIndex] = answer
      this.setState({ answers })
    },
    deleteOne: (id) => {
      const answers = this.state.answers
      const answerTotalCount = this.state.answerTotalCount - 1
      const answerIndex = answers.findIndex((c) => {
        return c.id == id
      })
      if (answerIndex < 0) return
      answers.splice(answerIndex, 1)
      this.setState({ answers, answerTotalCount })
    }
  }

  // Открыть: добавление
  openAddModal = () => {
    this.setState({ addModalVisible: true })
  }

  // Закрыть: добавление
  closeAddModal = () => {
    this.setState({ addModalVisible: false })
  }

  // Открыть: изменение
  openEditModal = (answerId) => {
    this.setState({ editModalVisible: true, answerId: answerId })
  }

  // Закрыть: изменение
  closeEditModal = () => {
    this.setState({ editModalVisible: false })
  }

  // Загрузка
  load = () => {
    const { search, page } = this.state
    const offset = Math.abs(page - 1) * 50

    if (source.token) source.token = null
    else source.cancel()

    // mockup data
    const answers = [
      {
        id: 1,
        title: 'Заголовок вопроса #1',
        content: 'Сам ответ на вопрос...',
        tags: [
          'Тег #1', 'Тег #2', 'Тег #3'
        ]
      },
      {
        id: 2,
        title: 'Заголовок вопроса #2',
        content: 'Сам ответ на вопрос...',
        tags: [
          'Тег #1', 'Тег #2', 'Тег #3'
        ]
      }
    ]
    const answerTotalCount = 2
    this.setState({ answers, answerTotalCount })

    // axios
    //   .get(
    //     config.serverUrl + '/app-api/projects/' + this.props.project.id + '/answers/'
    //     + '?offset=' + offset
    //     + '&search=' + search,
    //     {
    //       cancelToken: source.token
    //     }
    //   )
    //   .then((res) => {
    //     const answers = res.data.answers;
    //     const answerTotalCount = res.data.answerTotalCount;
    //     this.setState({ answers, answerTotalCount });
    //   })
    //   .catch((err) => {
    //     Modal.error({ title: 'Ошибка при отправке запроса', content: err.message });
    //   });
  }

  // Установить поиск
  setSearch = (event) => {
    this.setState({ search: event.target.value.trim(), answers: null }, () => this.load())
  }

  // Установить страницу
  setPage = (page) => {
    this.setState({ page, answers: null }, () => this.load())
  }

  componentDidMount () {
    setTitle('База знаний')
    this.load()
  }

  componentWillUnmount () {
    source.cancel()
  }

  render () {
    return (
      <div>
        <div className='app-main-view-header'>
          <div className='app-main-view-header-title'>
            База знаний {this.state.answerTotalCount > 0 ? <div className='app-main-view-header-title-counter'>({this.state.answerTotalCount})</div> : null}
          </div>
          <div className='app-main-view-header-controls'>
            <div className='app-main-view-header-control search'>
              <Input allowClear onChange={this.setSearch} placeholder='Поиск...' style={{ width: 200 }} prefix={<Icon type='search' style={{ color: 'rgba(0,0,0,.25)' }} />} />
            </div>
            <div className='app-main-view-header-control btn'>
              <Button onClick={this.openAddModal} type='primary' icon='plus'>Добавить ответ</Button>
            </div>
          </div>
        </div>
        <div className='app-main-view-content'>
          <List
            bordered
            size='large'
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='База знаний проекта пока пуста.' /> }}
            loading={!this.state.answers}
            pagination={this.state.answers && (this.state.answerTotalCount > this.state.answers.length) ? {
              size: 'large',
              pageSize: 50,
              total: this.state.answerTotalCount,
              onChange: (page, pageSize) => {
                this.setPage(page)
              }
            } : false}
            dataSource={this.state.answers ? this.state.answers : []}
            renderItem={item => <AnswerItem projectId={this.props.project.id} answer={item} list={this.list} openEditModal={this.openEditModal} />}
          />
        </div>
        <AddAnswerDrawer
          projectId={this.props.project.id}
          visible={this.state.addModalVisible}
          list={this.list}
          close={this.closeAddModal}
        />
        {
          this.state.answerId ? (
            <EditAnswerDrawer
              list={this.list}
              answerId={this.state.answerId}
              projectId={this.props.project.id}
              visible={this.state.editModalVisible}
              close={this.closeEditModal}
            />
          ) : null
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    project: state.project
  }
}

export default connect(mapStateToProps)(KnowledgeBase)
