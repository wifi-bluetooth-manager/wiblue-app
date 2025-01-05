pub enum WifiManagerError {
    CommandExecutionFailure,
}
pub enum WifiConnectionError {
    NoPasswordProvided,
    WrongPassword,
    NoSuchNetwork,
    UnknownError,
}
