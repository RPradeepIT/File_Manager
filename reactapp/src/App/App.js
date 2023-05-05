import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfirmProvider } from 'material-ui-confirm'
import { useQuery, QueryClientProvider, QueryClient } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import FFToast from '../views/components/base/FFToast/FFToast'
import useAppContext from '../views/components/hooks/useToast'
import usePageTitle from '../views/components/hooks/usePageTitle'
import FFSpinner from '../views/components/base/FFSpinner/FFSpinner'
import FFBackdrop from '../views/components/base/FFBackdrop/FFBackdrop'
import ErrorBoundary from '../views/components/custom/ErrorBoundary/ErrorBoundary'
import Routes from '../views/Routes/Routes'
import './App.css'

const App = () => {
  const toastRef = React.useRef()
  const actionRef = React.useRef()
  const loadingRef = React.useRef()
  const pagetitleRef = React.useRef()
  const { Provider: AppContext } = useAppContext()
  const { Provider: PageTitleProvider } = usePageTitle()
  const [userId, setUserId] = React.useState('')

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })

  function showToastMessage(message, status) {
    toastRef.current.setToastMessage(message, status)
  }

  function showLoading(state) {
    loadingRef.current.showLoading(state)
  }

  function setPageTitle(title) {
    // pagetitleRef.current.setPageTitle(title)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="app-root">
          <Router>
            <AppContext
              value={{
                showToastMessage,
                showLoading,
                userId,
              }}
            >
              <div className="app-content">
                <Suspense fallback={<FFSpinner />}>
                  <PageTitleProvider value={{ setPageTitle }}>
                    <FFToast ref={toastRef} />
                    <ConfirmProvider>
                      <Routes />
                    </ConfirmProvider>
                  </PageTitleProvider>
                </Suspense>
              </div>
            </AppContext>
            <FFBackdrop ref={loadingRef} />
          </Router>
        </div>
      </ErrorBoundary>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App
