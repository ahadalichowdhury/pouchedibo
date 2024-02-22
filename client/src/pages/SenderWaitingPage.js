import React from 'react'
import { Button } from 'react-bootstrap'

function SenderWaitingPage() {
  return (
    <div style={{ height: "100vh" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="modal "
        >
          <div
            style={{ width: "500px", borderRadius: "20px", height: "300px" }}
            className="box-shadow shadow-lg p-3 mb-5 bg-light d-flex justify-content-center align-items-center"
          >
            <div>
              <div>
                <h4 className="text-dark text-center h-3">Please wait for Driver or go to the home page</h4>
              </div>
              <div className="d-flex  flex-row mt-4 ms-3 pb-3">
                <Button
                  variant="primary"
                  className="mx-auto"
                  onClick={()=> window.location.href="/"}
                >
                  Go back HomePage
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

  )
}

export default SenderWaitingPage