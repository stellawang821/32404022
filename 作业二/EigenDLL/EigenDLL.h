#pragma once

#ifdef EIGENDLL_EXPORTS
#define EIGEN_API __declspec(dllexport)
#else
#define EIGEN_API __declspec(dllimport)
#endif

extern "C" {
    // ����������� (����ָ������free_matrix�ͷ�)
    EIGEN_API double* generate_random_matrix();

    // CPU����ֵ���� (real��imag��Ԥ����100��������)
    EIGEN_API void calculate_eigenvalues_cpu(double* matrix, double* real, double* imag);

    // GPU����ֵ���� (���ؼ���ʱ��ms)
    EIGEN_API double calculate_eigenvalues_gpu(double* matrix, double* real, double* imag);

    // �ͷž����ڴ�
    EIGEN_API void free_matrix(double* matrix);
}