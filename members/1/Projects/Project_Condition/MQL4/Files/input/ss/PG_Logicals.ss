(defun xcxc () (AndS BOLLINGER_0 S_ABOVE P_H1 )
)
(defun condition1 () (AND (AndS BOLLINGER_0 S_DOWN P_H1 )
(AndS BOLLINGER_0 S_CROSS_DOWN P_H1 )
)
)
(defun condition2 () (AND (AndS BOLLINGER_0 S_DOWN P_H1 )
(AndS MA_0 S_DOWN P_H1 )
)
)
(defun condition3 () (AND (condition2 )
(condition1 )
)
)
(defun ssssssss () (AND (AndS BOLLINGER_0 S_ABOVE P_H1 )
(AndS BOLLINGER_0 S_DOWN P_H1 )
)
)