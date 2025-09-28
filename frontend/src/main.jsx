import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getProfile }  from '@/store/authSlice';

import MainLayout      from '@/layouts/MainLayout';
import ProtectedRoute  from '@/components/ProtectedRoute';
import Index           from '@/pages/Index';
import SignIn          from '@/pages/SignIn';
import SignUp          from '@/pages/SignUp';
import Problem         from '@/pages/Problem';
import ProblemEditor   from '@/pages/ProblemEditor';
import ProblemSetter   from '@/pages/ProblemSetter';
import Dashboard       from '@/pages/Dashboard';
import Contest         from '@/pages/Contest';
import Leaderboard    from '@/pages/Leaderboard';
export default function App() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

   if (status === 'loading' || status === 'idle') return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/'            element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/signin"      element={<ProtectedRoute><SignIn /></ProtectedRoute>} />
          <Route path="/signup"      element={<ProtectedRoute><SignUp /></ProtectedRoute>} />
          <Route path="/problems"    element={<ProtectedRoute><Problem /></ProtectedRoute>} />
          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/contests"    element={<ProtectedRoute><Contest /></ProtectedRoute>} />
          <Route path="/createProblem" element={<ProtectedRoute><ProblemSetter /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        </Route>
        <Route path="/problems/:id" element={<ProtectedRoute><ProblemEditor /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
