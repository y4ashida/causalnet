import React from 'react'
import Controller from './controller'
import NetworkDiagram from './network-diagram'
import Sem from './sem'
import styles from './app.css'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    this.subscription = this.props.store.subscribe((state) => {
      this.setState(state)
    })
  }

  componentWillUnmount () {
    this.dataSubscription.dispose()
  }

  render () {
    const {
      layout,
      control,
      sem
    } = this.state
    return <div>
      <div className={styles.networkDiagramWrapper}>
        <NetworkDiagram vertices={layout.vertices} edges={layout.edges} />
      </div>
      <div className={styles.controllerWrapper}>
        <Controller
          variableTypes={control.variableTypes}
          layers={control.layers}
          cells={control.cells}
          rThreshold={control.rThreshold}
          biclusteringOption={control.biclusteringOption}
          svgWidth={layout.width}
          svgHeight={layout.height} />
      </div>
      <div className={styles.semWrapper}>
        <Sem vertices={sem.vertices} edges={sem.edges} attributes={sem.attributes} />
      </div>
    </div>
  }
}

export default App
