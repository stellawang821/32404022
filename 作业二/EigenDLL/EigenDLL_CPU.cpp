#include "EigenDLL.h"
#include <Eigen/Dense>
#include <random>

using namespace Eigen;

extern "C" {
    double* generate_random_matrix() {
        MatrixXd m = MatrixXd::Random(100, 100);
        // 确保满秩：对角线增强
        for (int i = 0; i < 100; ++i) {
            m(i, i) += 1.0 * i;
        }

        double* data = new double[10000];
        Map<MatrixXd>(data, 100, 100) = m;
        return data;
    }

    void calculate_eigenvalues_cpu(double* matrix, double* real, double* imag) {
        Map<MatrixXd> mat(matrix, 100, 100);
        EigenSolver<MatrixXd> solver(mat);
        auto evs = solver.eigenvalues();
        for (int i = 0; i < 100; ++i) {
            real[i] = evs[i].real();
            imag[i] = evs[i].imag();
        }
    }

    void free_matrix(double* matrix) {
        delete[] matrix;
    }
}